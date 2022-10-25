import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/app/store";

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
  lapTimes: number[];
  targetIndexes: number[];
  targetLapTimes: Record<string, number[]>;
}

const initialState: PaceAnalysisState = {
  lapTimeLimit: 5,
  lapTimes: [],
  targetIndexes: [],
  targetLapTimes: {},
};

interface AddTargetCarLapTime {
  carIndex: number;
  lapTime: number;
}

export const paceAnalysisSlice = createSlice({
  name: "paceAnalysis",
  initialState,
  reducers: {
    setLapTimeLimit: (state, action: PayloadAction<number>) => {
      state.lapTimeLimit = action.payload;
    },
    addLapTime: (state, action: PayloadAction<number>) => {
      state.lapTimes.push(action.payload);
      while (state.lapTimes.length > state.lapTimeLimit) state.lapTimes.shift();
    },
    addTargetCarIndex: (state, action: PayloadAction<number>) => {
      if (state.targetIndexes.includes(action.payload)) {
        return;
      }

      state.targetIndexes.push(action.payload);
      state.targetLapTimes[action.payload] = [];
    },
    removeTargetCarIndex: (state, action: PayloadAction<number>) => {
      delete state.targetLapTimes[action.payload];
    },
    addTargetCarLapTime: (
      state,
      action: PayloadAction<AddTargetCarLapTime>,
    ) => {
      const targetCarLapTimes =
        state.targetLapTimes?.[action.payload.carIndex] || [];
      targetCarLapTimes.push(action.payload.lapTime);
      while (targetCarLapTimes.length > state.lapTimeLimit)
        targetCarLapTimes.shift();

      state.targetLapTimes[action.payload.carIndex] = targetCarLapTimes;
    },
  },
});

export const { setLapTimeLimit } = paceAnalysisSlice.actions;

export const selectPaceAnalysis = (state: RootState) => state.paceAnalysis;

export const selectAverageLapTime = (state: RootState) => {
  return averageLapTimes(state.paceAnalysis.lapTimes);
};

export const selectAverageLapTimeForTarget =
  (targetIndex: number) => (state: RootState) => {
    return averageLapTimes(state.paceAnalysis.targetLapTimes?.[targetIndex]);
  };

export default paceAnalysisSlice.reducer;
