import { createSlice } from "@reduxjs/toolkit";
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

export const selectSessionPace = ({ sessionPace }: RootState) => sessionPace;

export const selectSessionPaceForClass =
  (classId: string) =>
  ({ sessionPace }: RootState) => {
    return sessionPace[classId];
  };

export const selectTopClassId = ({ sessionPace }: RootState) => {
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
};

export const selectTopClass = (state: RootState) => {
  const topClassId = selectTopClassId(state);
  return selectSessionPaceForClass(topClassId)(state);
};

export const selectOtherClasses = (state: RootState) => {
  const topClassId = selectTopClassId(state);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [topClassId]: topClass, ...otherClasses } = state.sessionPace;
  return otherClasses;
};

export const selectEstimatedTotalLaps = (state: RootState) => {
  const topClassId = selectTopClassId(state);
  const topClassPace = selectTopClass(state);
  const otherClasses = selectOtherClasses(state);

  if (!topClassPace) {
    return null;
  }

  const topClassAverageLapTime = selectAverageLapTime(topClassPace);

  const estimatedLapsRemaining =
    Math.max(1, topClassPace.sessionTimeRemaining) / topClassAverageLapTime;

  const topClassTotalLaps = topClassPace.lapsComplete + estimatedLapsRemaining;

  return Object.keys(otherClasses).reduce(
    (index, classId) => {
      const pace = otherClasses[classId];
      const paceAverageLapTime = selectAverageLapTime(pace);
      const timeRemainingDifference =
        topClassPace.sessionTimeRemaining - pace.sessionTimeRemaining;

      const estimatedLapsRemaining =
        Math.max(
          1,
          topClassPace.sessionTimeRemaining - timeRemainingDifference,
        ) / paceAverageLapTime;

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
};

export default sessionPaceSlice.reducer;
