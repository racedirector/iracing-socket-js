import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PitServiceFlags } from "@racedirector/iracing-socket-js";

export interface PitStopAnalysisState {
  serviceStarted: boolean;
}

const initialState: PitStopAnalysisState = {
  serviceStarted: false,
};

export const pitStopAnalaysisSlice = createSlice({
  name: "pitStopAnalysis",
  initialState,
  reducers: {
    serviceStart: (state) => {
      state.serviceStarted = true;
    },
    serviceEnd: () => {},
  },
});

export const { serviceStart, serviceEnd } = pitStopAnalaysisSlice.actions;

export const selectAverageStopTime = (state: PitStopAnalysisState) => {};
export const selectLastStopTime = (state: PitStopAnalysisState) => {};

export default pitStopAnalaysisSlice.reducer;
