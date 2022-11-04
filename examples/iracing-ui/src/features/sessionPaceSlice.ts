import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  selectCurrentSessionClassLeaders,
  selectCurrentSessionIsRaceSession,
  RaceTime,
  SessionState,
  selectCurrentSession,
} from "@racedirector/iracing-socket-js";
import { isEqual, omit } from "lodash";
import averagePaceReducer, {
  addLapTime,
  AveragePaceState,
  selectAverageLapTime,
  setLapsComplete,
  setLapTimes,
  AddLapTimePayload,
} from "./averagePaceSlice";
import { RootState } from "src/app/store";
import { startAppListening } from "src/app/middleware";

export interface SessionPaceState {
  [classId: string]: AveragePaceState;
}

const initialState: SessionPaceState = {};

interface SetLapsCompleteForClassPayload {
  classId: string;
  lapsComplete: number;
}

interface SetLapTimesForClassPayload extends AddLapTimePayload {
  classId: string;
}

interface AddLapTimeForClassPayload extends AddLapTimePayload {
  classId: string;
}

export const sessionPaceSlice = createSlice({
  name: "sessionPace",
  initialState,
  reducers: {
    setLapsCompleteForClass: (
      state,
      action: PayloadAction<SetLapsCompleteForClassPayload>,
    ) => {
      state[action.payload.classId] = averagePaceReducer(
        state[action.payload.classId],
        setLapsComplete(action.payload.lapsComplete),
      );
    },
    setLapTimesForClass: (
      state,
      action: PayloadAction<SetLapTimesForClassPayload>,
    ) => {
      state[action.payload.classId] = averagePaceReducer(
        state[action.payload.classId],
        setLapTimes(omit(action.payload, "classId")),
      );
    },
    addLapTimeForClass: (
      state,
      action: PayloadAction<AddLapTimeForClassPayload>,
    ) => {
      state[action.payload.classId] = averagePaceReducer(
        state[action.payload.classId],
        addLapTime(omit(action.payload, "classId")),
      );
    },
  },
});

export const {
  setLapsCompleteForClass,
  setLapTimesForClass,
  addLapTimeForClass,
} = sessionPaceSlice.actions;

/**
 *
 * @param state The root state
 * @returns `SessionPaceState`, an index represnting the pace of each class.
 */
export const selectSessionPace = (state: RootState) => state.sessionPace;

export const selectTopClassId = createSelector(
  selectSessionPace,
  (sessionPace) => {
    return Object.entries(sessionPace).reduce<string>(
      (topClassId, [classId, paceData]) => {
        if (!topClassId) {
          return classId;
        }

        const topClass = sessionPace[topClassId];
        const topClassAverageLapTime = selectAverageLapTime(topClass);
        const classAverageLapTime = selectAverageLapTime(paceData);

        // If this class has done more laps than the current top class,
        // it is now the top class.
        if (paceData.lapsComplete > topClass.lapsComplete) {
          return classId;
        }

        // If this class has a faster average lap time,
        // is is now the top class.
        if (classAverageLapTime < topClassAverageLapTime) {
          return classId;
        }

        return topClassId;
      },
      null,
    );
  },
);

export const selectClassById = (state: RootState, classId: string) =>
  state.sessionPace[classId];

export const selectAveragePaceById = (state: RootState, classId: string) =>
  selectAverageLapTime(state.sessionPace?.[classId]);

export const selectTopClass = (state: RootState) => {
  const topClassId = selectTopClassId(state);
  return selectClassById(state, topClassId);
};

export const selectAveragePace = (state: RootState) => {
  const sessionPace = selectSessionPace(state);
  return Object.entries(sessionPace).reduce(
    (aggregate, [classId, pace]) => ({
      ...aggregate,
      [classId]: selectAverageLapTime(pace),
    }),
    {},
  );
};

export const selectOtherClasses = createSelector(
  selectTopClassId,
  selectSessionPace,
  (topClassId, sessionPace) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [topClassId]: topClass, ...otherClasses } = sessionPace;
    return otherClasses;
  },
);

export const selectEstimatedTotalLaps = createSelector(
  selectTopClassId,
  selectTopClass,
  selectOtherClasses,
  (topClassId, topClass, otherClasses) => {
    if (!topClass) {
      return null;
    }

    const topClassAverageLapTime = selectAverageLapTime(topClass);
    const estimatedLapsRemaining =
      Math.max(1, topClass.sessionTimeRemaining) / topClassAverageLapTime;

    const topClassTotalLaps = topClass.lapsComplete + estimatedLapsRemaining;

    return Object.keys(otherClasses).reduce(
      (index, classId) => {
        const pace = otherClasses[classId];
        const paceAverageLapTime = selectAverageLapTime(pace);
        const timeRemainingDifference =
          topClass.sessionTimeRemaining - pace.sessionTimeRemaining;

        const estimatedLapsRemaining =
          Math.max(1, topClass.sessionTimeRemaining - timeRemainingDifference) /
          paceAverageLapTime;

        const totalClassLaps = pace.lapsComplete + estimatedLapsRemaining;

        return {
          ...index,
          [classId]: Math.round(totalClassLaps),
        };
      },
      {
        [topClassId]: Math.round(topClassTotalLaps),
      },
    );
  },
);

export const selectLapsCompleted = (state: RootState) => {
  const sessionPace = selectSessionPace(state);
  return Object.entries(sessionPace).reduce(
    (aggregate, [classId, classPace]) => {
      return {
        ...aggregate,
        [classId]: Math.max(0, classPace.lapsComplete),
      };
    },
    {},
  );
};

export const selectEstimatedLapsRemaining = (state: RootState) => {
  const sessionPace = selectSessionPace(state);
  const estimatedTotalLapsIndex = selectEstimatedTotalLaps(state);

  return Object.entries(sessionPace).reduce(
    (aggregateIndex, [classId, classPace]) => {
      const normalizedLapsComplete = Math.max(0, classPace.lapsComplete);
      const estimatedTotalLaps = estimatedTotalLapsIndex?.[classId] || 0;

      return {
        ...aggregateIndex,
        [classId]: Math.ceil(estimatedTotalLaps) - normalizedLapsComplete,
      };
    },
    {},
  );
};

interface RaceLengthContext {
  // The number of race laps reported by the sim
  raceLaps: number | null;
  // The laps remaining based on `estimatedLaps` and `lapsComplete`
  lapsRemaining: Record<string, number>;
  // The number of laps completed indexed by class ID
  lapsComplete: Record<string, number>;
  // The length of the race reported by the sim
  sessionLength: RaceTime;
  isRaceTimed: boolean;
  // The total estimated laps indexed by class ID
  estimatedLaps: Record<string, number>;
}

export const selectRaceLengthContext = createSelector(
  [
    selectEstimatedTotalLaps,
    selectEstimatedLapsRemaining,
    selectLapsCompleted,
    ({ iRacing }) => selectCurrentSession(iRacing),
  ],
  (
    totalLapsIndex,
    lapsRemaining,
    lapsComplete,
    currentSession,
  ): RaceLengthContext => {
    const sessionLength: RaceTime =
      currentSession?.SessionTime === "unlimited"
        ? currentSession?.SessionTime
        : parseInt(currentSession?.SessionTime);

    return {
      raceLaps: parseInt(currentSession?.SessionLaps) || null,
      lapsComplete,
      sessionLength,
      lapsRemaining: lapsRemaining,
      isRaceTimed: typeof sessionLength === "number",
      estimatedLaps: totalLapsIndex,
    };
  },
);

startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentClassLeaders = selectCurrentSessionClassLeaders(
      currentState.iRacing,
    );
    const previousClassLeaders = selectCurrentSessionClassLeaders(
      previousState.iRacing,
    );

    const classLeadersChanged = !isEqual(
      currentClassLeaders,
      previousClassLeaders,
    );

    return classLeadersChanged;
  },
  effect: (_action, listenerApi) => {
    const currentState = listenerApi.getState();
    const iRacingState = currentState.iRacing;
    const currentClassLeaders = selectCurrentSessionClassLeaders(iRacingState);
    const isRacing =
      currentState.iRacing.data?.SessionState || SessionState.Invalid;
    const isRaceSession = selectCurrentSessionIsRaceSession(iRacingState);

    Object.entries(currentClassLeaders).forEach(([classId, leader]) => {
      const classPace = selectClassById(currentState, classId);
      const averageLapTime = classPace ? selectAverageLapTime(classPace) : -1;

      const isInvalid =
        (isRaceSession && leader.LapsComplete < 2) ||
        (isRaceSession && leader.LapsComplete <= classPace?.lapsComplete) ||
        (!isRaceSession && leader.FastestTime <= averageLapTime);

      if (isInvalid) {
        return;
      }

      if (isRaceSession) {
        listenerApi.dispatch(
          setLapsCompleteForClass({
            classId,
            lapsComplete: leader.LapsComplete,
          }),
        );
      }

      const shouldUpdateLapTimes = isRacing && leader.LastTime > 0;
      if (shouldUpdateLapTimes) {
        const payload = {
          classId,
          lapTime: leader.LastTime,
          sessionTimeRemaining: iRacingState.data?.SessionTimeRemain,
        };

        listenerApi.dispatch(
          isRaceSession
            ? addLapTimeForClass(payload)
            : setLapTimesForClass(payload),
        );
      }
    });
  },
});

export default sessionPaceSlice.reducer;
