import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import averagePaceReducer, {
  addLapTime,
  AveragePaceState,
  selectAverageLapTime,
  setLapsComplete,
  setLapTimes,
} from "./averagePaceSlice";
import { omit } from "lodash";
import { RootState } from "src/app/store";

export interface SessionPaceState {
  [classId: string]: AveragePaceState;
}

const initialState: SessionPaceState = {};

interface SetLapsCompleteForClassPayload {
  classId: string;
  lapsComplete: number;
}

interface SetLapTimesForClassPayload {
  classId: string;
  sessionTimeRemaining: number;
  lapTimes: number[];
}

interface AddLapTimeForClassPayload {
  classId: string;
  sessionTimeRemaining: number;
  lapTime: number;
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

export default sessionPaceSlice.reducer;
