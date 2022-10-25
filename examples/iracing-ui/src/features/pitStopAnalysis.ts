import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PitServiceFlags } from "@racedirector/iracing-socket-js";

export interface PitStopAnalysisState {
  lastStopTime?: number;
  stopTimes: number[];
  stopService: PitServiceFlags[];
}

const initialState: PitStopAnalysisState = {
  stopTimes: [],
  stopService: [],
};

export const pitStopAnalaysisSlice = createSlice({
  name: "pitStopAnalysis",
  initialState,
  reducers: {
    addStopTime: () => {},
    addService: () => {},
  },
});

export const { addStopTime, addService } = pitStopAnalaysisSlice.actions;

export const selectAverageStopTime = (state: PitStopAnalysisState) => {};
export const selectLastStopTime = (state: PitStopAnalysisState) => {};

export default pitStopAnalaysisSlice.reducer;
