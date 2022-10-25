import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const averageLapTimes = (lapTimes: number[]) => {
  const minLapTime = 2 + Math.min.apply(null, lapTimes);

  const validLaps = lapTimes.filter((lapTime) => lapTime < minLapTime);

  const totalLapTime = validLaps.reduce(
    (aggregateLapTimes, lapTime) => aggregateLapTimes + lapTime,
  );

  return totalLapTime / validLaps.length;
};

export interface AveragePaceState {
  lapsComplete: number;
  lapTimeLimit: number;
  lapTimes: number[];
  sessionTimeRemaining: number;
}

const initialState: AveragePaceState = {
  lapsComplete: 0,
  lapTimeLimit: 5,
  lapTimes: [],
  sessionTimeRemaining: -1,
};

interface AddLapTimePayload {
  sessionTimeRemaining: number;
  lapTime: number;
}

interface SetLapTimesPayload {
  sessionTimeRemaining: number;
  lapTimes: number[];
}

export const averagePaceSlice = createSlice({
  name: "averagePace",
  initialState,
  reducers: {
    setLapsComplete: (state, action: PayloadAction<number>) => {
      state.lapsComplete = action.payload;
    },
    setLapTimes: (state, action: PayloadAction<SetLapTimesPayload>) => {
      const { lapTimes, sessionTimeRemaining } = action.payload;
      state.lapTimes = lapTimes;
      // state.averageLapTime = averageLapTimes(lapTimes);
      state.sessionTimeRemaining = sessionTimeRemaining;
    },
    addLapTime: (state, action: PayloadAction<AddLapTimePayload>) => {
      const { lapTime, sessionTimeRemaining } = action.payload;
      state.lapTimes.push(lapTime);
      while (state.lapTimes.length > state.lapTimeLimit) state.lapTimes.shift();
      // state.averageLapTime = averageLapTimes(state.lapTimes);
      state.sessionTimeRemaining = sessionTimeRemaining;
    },
  },
});

export const { setLapsComplete, addLapTime, setLapTimes } =
  averagePaceSlice.actions;

export const selectAverageLapTime = (state: AveragePaceState) =>
  averageLapTimes(state.lapTimes);

export default averagePaceSlice.reducer;