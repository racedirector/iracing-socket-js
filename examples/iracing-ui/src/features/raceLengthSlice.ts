import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RaceTime } from "@racedirector/iracing-socket-js";
import { RootState } from "src/app/store";

export interface RaceLengthState {
  sessionLaps: number;
  raceLaps: number;
  lengthInSeconds: RaceTime;
}

const initialState: RaceLengthState = {
  sessionLaps: 28,
  raceLaps: 28,
  lengthInSeconds: "unlimited",
};

export const raceLengthSlice = createSlice({
  name: "raceLength",
  initialState,
  reducers: {
    setSessionLaps: (state, action: PayloadAction<number>) => {
      state.sessionLaps = action.payload;
    },
    setRaceLaps: (state, action: PayloadAction<number>) => {
      state.raceLaps = action.payload;
      state.sessionLaps = action.payload;
    },
    setRaceLength: (state, action: PayloadAction<RaceTime>) => {
      state.lengthInSeconds = action.payload;
    },
    setEstimatedLaps: (state, action: PayloadAction<number>) => {
      state.sessionLaps = action.payload;
      state.raceLaps = action.payload;
    },
  },
});

export const { setSessionLaps, setRaceLaps, setRaceLength, setEstimatedLaps } =
  raceLengthSlice.actions;

export const selectRaceLength = (state: RootState) => state.raceLength;

export default raceLengthSlice.reducer;
