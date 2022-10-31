import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { pick } from "lodash";

// !!!: This is copy-pasta from `averagePaceSlice`
const averageLapTimes = (lapTimes: number[]) => {
  const minLapTime = 2 + Math.min.apply(null, lapTimes);

  const validLaps = lapTimes.filter((lapTime) => lapTime < minLapTime);

  const totalLapTime = validLaps.reduce(
    (aggregateLapTimes, lapTime) => aggregateLapTimes + lapTime,
  );

  return totalLapTime / validLaps.length;
};

export interface PaceAnalysisState {
  lapTimeLimit: number;
  targetLapTimes: Record<string, number[]>;
}

const initialState: PaceAnalysisState = {
  lapTimeLimit: 10,
  targetLapTimes: {},
};

export const paceAnalysisSlice = createSlice({
  name: "paceAnalysis",
  initialState,
  reducers: {
    setLapTimeLimit: (state, action: PayloadAction<number>) => {
      state.lapTimeLimit = action.payload;
    },
    addTargetLapTimes: (
      state,
      action: PayloadAction<Record<string, number>>,
    ) => {
      Object.entries(action.payload).forEach(([carIndex, lapTime]) => {
        const lapTimes = state.targetLapTimes[carIndex] || [];
        lapTimes.push(lapTime);
        while (lapTimes.length > state.lapTimeLimit) lapTimes.shift();
        state.targetLapTimes[carIndex] = lapTimes;
      });
    },
  },
});

export const { setLapTimeLimit, addTargetLapTimes } = paceAnalysisSlice.actions;

export const selectPaceAnalysis = (state: RootState) => state.paceAnalysis;

export const selectAverageLapTimesForTargets = (
  state: RootState,
  targetIndexes: string[],
): Record<string, number> => {
  const targetLapTimes = pick(
    state.paceAnalysis.targetLapTimes,
    ...targetIndexes,
  );

  return Object.entries(targetLapTimes).reduce(
    (lapTimeIndex, [carIndex, lapTimes]) => {
      return {
        ...lapTimeIndex,
        [carIndex]: averageLapTimes(lapTimes),
      };
    },
    {},
  );
};

export const selectAverageLapTimesForTargetsByClass = (
  state: RootState,
  targetIndexesByClass: Record<string, string[]>,
) => {
  return Object.entries(targetIndexesByClass).reduce(
    (index, [classId, targetIndexes]) => {
      const targetLapTimes = selectAverageLapTimesForTargets(
        state,
        targetIndexes,
      );

      const lapTimes = Object.values(targetLapTimes);
      const totalLapTime = lapTimes.reduce(
        (totalLapTime, averageLapTime) => totalLapTime + averageLapTime,
        0,
      );

      return {
        ...index,
        [classId]: totalLapTime / lapTimes.length,
      };
    },
    {},
  );
};

export const selectAverageLapTimeForSession = (state: RootState) => {
  const averageLapTimes = selectAverageLapTimesForTargets(
    state,
    Object.keys(state.paceAnalysis.targetLapTimes),
  );

  const lapTimes = Object.values(averageLapTimes);
  const totalLapTime = lapTimes.reduce(
    (totalLapTime, averageLapTime) => totalLapTime + averageLapTime,
    0,
  );

  return totalLapTime / lapTimes.length;
};

export const selectLastLapTimesForTargets = (state: RootState) => {
  return Object.entries(state.paceAnalysis.targetLapTimes).reduce(
    (lapTimeIndex, [carIndex, lapTimes]) => {
      return {
        ...lapTimeIndex,
        [carIndex]: lapTimes[lapTimes.length - 1],
      };
    },
    {},
  );
};

export default paceAnalysisSlice.reducer;
