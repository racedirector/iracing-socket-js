import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PitServiceFlags } from "@racedirector/iracing-socket-js";

interface TirePressures {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
}

interface PitStopServiceRequest {
  tirePressures: TirePressures;
  tireCompound: number;
  service: PitServiceFlags;
  fuelAmount: number;
}

interface PitStop {
  service: PitStopServiceRequest;
  stopTime: number;
  optionalRepairsRemaining: number;
  requiredRepairsRemaining: number;
}

export interface PitStopAnalysisState {
  serviceStarted: boolean;
  serviceStartSessionTime: number;
  stops: Record<string, PitStop>;
}

const initialState: PitStopAnalysisState = {
  serviceStarted: false,
  serviceStartSessionTime: -1,
  stops: {},
};

interface ServiceStartPayload {
  sessionTime: number;
  lapNumber: number;
  requestedService: PitServiceFlags;
  fuelAmount: number;
  tirePressures: TirePressures;
  tireCompound: number;
}

interface ServiceEndPayload {
  optionalRepairsRemaining: number;
  requiredRepairsRemaining: number;
  sessionTime: number;
}

export const pitStopAnalaysisSlice = createSlice({
  name: "pitStopAnalysis",
  initialState,
  reducers: {
    serviceStart: (state, action: PayloadAction<ServiceStartPayload>) => {
      state.serviceStarted = true;
      state.serviceStartSessionTime = action.payload.sessionTime;
    },
    serviceEnd: (state, action: PayloadAction<ServiceEndPayload>) => {
      if (state.serviceStarted) {
        state.serviceStarted = false;
      }
    },
  },
});

export const { serviceStart, serviceEnd } = pitStopAnalaysisSlice.actions;

export const selectAverageStopTime = (state: PitStopAnalysisState) => {};
export const selectLastStopTime = (state: PitStopAnalysisState) => {};

export default pitStopAnalaysisSlice.reducer;
