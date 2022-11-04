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
  // The number of laps completed
  lapsComplete: number;
  // The number of lap times to track
  lapTimeLimit: number;
  // The last `lapTimeLimit` lap times
  lapTimes: number[];
  // The session time remaining at the last update.
  // -1 represents it hasn't started yet.
  sessionTimeRemaining: number;
}

const initialState: AveragePaceState = {
  lapsComplete: 0,
  lapTimeLimit: 5,
  lapTimes: [],
  sessionTimeRemaining: -1,
};

export interface AddLapTimePayload {
  sessionTimeRemaining: number;
  lapTime: number;
}

export const averagePaceSlice = createSlice({
  name: "averagePace",
  initialState,
  reducers: {
    setLapTimeLimit: (state, action: PayloadAction<number>) => {
      state.lapTimeLimit = action.payload;
    },
    setLapsComplete: (state, action: PayloadAction<number>) => {
      state.lapsComplete = action.payload;
    },
    setLapTimes: (state, action: PayloadAction<AddLapTimePayload>) => {
      const { lapTime, sessionTimeRemaining } = action.payload;
      state.lapTimes = [lapTime];
      state.sessionTimeRemaining = sessionTimeRemaining;
    },
    addLapTime: (state, action: PayloadAction<AddLapTimePayload>) => {
      const { lapTime, sessionTimeRemaining } = action.payload;
      state.lapTimes.push(lapTime);
      while (
        state.lapTimeLimit > 0 &&
        state.lapTimes.length > state.lapTimeLimit
      ) {
        state.lapTimes.shift();
      }

      state.sessionTimeRemaining = sessionTimeRemaining;
    },
  },
});

export const { setLapsComplete, addLapTime, setLapTimes } =
  averagePaceSlice.actions;

export const selectLapTimes = (state: AveragePaceState) => state.lapTimes;

export const selectAverageLapTime = (state: AveragePaceState) => {
  const lapTimes = selectLapTimes(state);
  return averageLapTimes(lapTimes);
};

export const selectLapTimeLimit = (state: AveragePaceState) =>
  state.lapTimeLimit;

export default averagePaceSlice.reducer;
