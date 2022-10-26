import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  PitServiceFlags,
  PitServiceStatus,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { RootState } from "src/app/store";

interface TireChangeRequest {
  rightFront: boolean;
  rightRear: boolean;
  leftFront: boolean;
  leftRear: boolean;
}

interface PitServiceRequest {
  tearoff: boolean;
  fastRepair: boolean;
  tires: TireChangeRequest;
  fuel: boolean;
}

const serviceRequestForServiceFlags = (
  serviceFlags: PitServiceFlags,
): PitServiceRequest => ({
  tearoff: !!(serviceFlags & PitServiceFlags.WindshieldTearoff),
  fastRepair: !!(serviceFlags & PitServiceFlags.FastRepair),
  fuel: !!(serviceFlags & PitServiceFlags.Fuel),
  tires: {
    rightFront: !!(serviceFlags & PitServiceFlags.RFChange),
    rightRear: !!(serviceFlags & PitServiceFlags.RRChange),
    leftFront: !!(serviceFlags & PitServiceFlags.LFChange),
    leftRear: !!(serviceFlags & PitServiceFlags.LRChange),
  },
});

const serviceRequestHasTireRequest = (serviceFlags: PitServiceFlags) =>
  !!(
    serviceFlags &
    (PitServiceFlags.RFChange |
      PitServiceFlags.RRChange |
      PitServiceFlags.LFChange |
      PitServiceFlags.LRChange)
  );

const serviceRequestHasFuelRequest = (serviceFlags: PitServiceFlags) =>
  !!(serviceFlags & PitServiceFlags.Fuel);

const serviceRequestHasServiceRequest = (serviceFlags: PitServiceFlags) =>
  !!(
    serviceFlags &
    (PitServiceFlags.RFChange |
      PitServiceFlags.RRChange |
      PitServiceFlags.LFChange |
      PitServiceFlags.LRChange |
      PitServiceFlags.FastRepair |
      PitServiceFlags.Fuel |
      PitServiceFlags.WindshieldTearoff)
  );

interface PitStopServiceRequest {
  service: PitServiceFlags;
  fuelAmount: number;
}

interface PitStopTiming {
  pitLaneEntryTime?: number;
  pitLaneExitTime?: number;
  pitServiceEndTime?: number;
  pitServiceStartTime?: number;
  pitStallEntryTime?: number;
  pitStallExitTime?: number;
}

export interface PitStopAnalysisState {
  serviceState: PitServiceStatus;
  playerTrackLocation: TrackLocation;
  nextServiceRequest: PitStopServiceRequest;
  currentStopTiming: PitStopTiming;
  pastStopTiming: PitStopTiming[];
}

const initialState: PitStopAnalysisState = {
  serviceState: PitServiceStatus.None,
  playerTrackLocation: TrackLocation.NotInWorld,
  nextServiceRequest: {
    service: 0x0,
    fuelAmount: -1,
  },
  currentStopTiming: {},
  pastStopTiming: [],
};

interface UpdateServiceStatePayload {
  status: PitServiceStatus;
  sessionTime: number;
  lapNumber: number;
}

interface UpdateTrackLocationPayload {
  trackLocation: TrackLocation;
  sessionTime: number;
  lapNumber: number;
}

interface UpdateServiceFlagsPayload {
  serviceFlags: PitServiceFlags;
  sessionTime: number;
  fuelLevel?: number;
}

export const pitStopAnalaysisSlice = createSlice({
  name: "pitStopAnalysis",
  initialState,
  reducers: {
    updateTrackLocation: (
      state,
      action: PayloadAction<UpdateTrackLocationPayload>,
    ) => {
      const { trackLocation: nextTrackLocation, sessionTime } = action.payload;
      const previousTrackLocation = state.playerTrackLocation;

      if (
        previousTrackLocation === TrackLocation.OnTrack &&
        nextTrackLocation === TrackLocation.ApproachingPits
      ) {
        state.currentStopTiming.pitLaneEntryTime = sessionTime;
      } else if (
        previousTrackLocation === TrackLocation.ApproachingPits &&
        nextTrackLocation === TrackLocation.InPitStall
      ) {
        state.currentStopTiming.pitStallEntryTime = sessionTime;
      } else if (
        previousTrackLocation === TrackLocation.InPitStall &&
        nextTrackLocation === TrackLocation.ApproachingPits
      ) {
        state.currentStopTiming.pitStallExitTime = sessionTime;
      } else if (
        previousTrackLocation === TrackLocation.ApproachingPits &&
        nextTrackLocation === TrackLocation.OnTrack
      ) {
        state.currentStopTiming.pitLaneExitTime = sessionTime;
        const previousPitTiming = { ...state.currentStopTiming };
        state.currentStopTiming = {};

        // Only track the timing if there was service taken
        if (Object.keys(previousPitTiming).includes("pitServiceStartTime")) {
          state.pastStopTiming.push(previousPitTiming);
        }
      }

      state.playerTrackLocation = nextTrackLocation;
    },
    updateServiceFlags: (
      state,
      action: PayloadAction<UpdateServiceFlagsPayload>,
    ) => {
      const { serviceFlags, fuelLevel } = action.payload;
      state.nextServiceRequest.service = serviceFlags;
      state.nextServiceRequest.fuelAmount =
        serviceFlags & PitServiceFlags.Fuel ? fuelLevel : -1;
    },
    updateServiceStatus: (
      state,
      action: PayloadAction<UpdateServiceStatePayload>,
    ) => {
      const { status, sessionTime } = action.payload;

      switch (status) {
        case PitServiceStatus.InProgress:
          state.currentStopTiming.pitServiceStartTime = sessionTime;
          break;
        case PitServiceStatus.Complete:
          state.currentStopTiming.pitServiceEndTime = sessionTime;
          break;
        default:
          break;
      }

      state.serviceState = action.payload.status;
    },
  },
});

export const { updateServiceFlags, updateServiceStatus, updateTrackLocation } =
  pitStopAnalaysisSlice.actions;

export const selectPitStopAnalysis = (state: RootState) =>
  state.pitStopAnalysis;

export const selectPitStopIsActive = (state: PitStopAnalysisState) =>
  state.serviceState === PitServiceStatus.InProgress;

export const selectRequestedService = (state: PitStopAnalysisState) =>
  serviceRequestForServiceFlags(state.nextServiceRequest.service);

export default pitStopAnalaysisSlice.reducer;
