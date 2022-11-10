import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  PitServiceFlags,
  PitServiceStatus,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { RootState } from "src/app/store";
import {
  AppListenerEffect,
  AppListenerPredicate,
  startAppListening,
} from "src/app/middleware";
import { playerTrackLocationChanged } from "src/app/actions";

const serviceRequestForServiceFlags = (serviceFlags: PitServiceFlags) => ({
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

interface PitStopTiming {
  pitLaneEntryTime?: number;
  pitLaneExitTime?: number;
  pitServiceEndTime?: number;
  pitServiceStartTime?: number;
  pitStallEntryTime?: number;
  pitStallExitTime?: number;
}

const pitStopTimingSummary = ({
  pitLaneEntryTime = 0,
  pitLaneExitTime = 0,
  pitServiceEndTime = 0,
  pitServiceStartTime = 0,
  pitStallEntryTime = 0,
  pitStallExitTime = 0,
}) => ({
  pitLaneTime: pitLaneExitTime - pitLaneEntryTime,
  serviceTime: pitServiceEndTime - pitServiceStartTime,
  pitStallTime: pitStallExitTime - pitStallEntryTime,
});

export interface PitStopAnalysisState {
  currentStopTiming: PitStopTiming;
  pastStopTiming: PitStopTiming[];
}

const initialState: PitStopAnalysisState = {
  currentStopTiming: {},
  pastStopTiming: [],
};

interface UpdateServiceFlagsPayload {
  flags: PitServiceFlags;
  sessionTime: number;
}

interface UpdateServiceStatePayload {
  status: PitServiceStatus;
  sessionTime: number;
  lapNumber: number;
}

export const pitStopAnalaysisSlice = createSlice({
  name: "pitStopAnalysis",
  initialState,
  reducers: {
    updateServiceFlags: (
      _state,
      _action: PayloadAction<UpdateServiceFlagsPayload>,
    ) => {},
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
    },
  },
  extraReducers: (builder) =>
    builder.addCase(playerTrackLocationChanged, (state, action) => {
      const { previousTrackLocation, currentTrackLocation, sessionTime } =
        action.payload;
      if (
        previousTrackLocation === TrackLocation.OnTrack &&
        currentTrackLocation === TrackLocation.ApproachingPits
      ) {
        state.currentStopTiming.pitLaneEntryTime = sessionTime;
      } else if (
        previousTrackLocation === TrackLocation.ApproachingPits &&
        currentTrackLocation === TrackLocation.InPitStall
      ) {
        state.currentStopTiming.pitStallEntryTime = sessionTime;
      } else if (
        previousTrackLocation === TrackLocation.InPitStall &&
        currentTrackLocation === TrackLocation.ApproachingPits
      ) {
        state.currentStopTiming.pitStallExitTime = sessionTime;
      } else if (
        previousTrackLocation === TrackLocation.ApproachingPits &&
        currentTrackLocation === TrackLocation.OnTrack
      ) {
        state.currentStopTiming.pitLaneExitTime = sessionTime;
        const previousPitTiming = { ...state.currentStopTiming };
        state.currentStopTiming = {};

        // Only track the timing if there was service taken
        if (Object.keys(previousPitTiming).includes("pitServiceStartTime")) {
          state.pastStopTiming.push(previousPitTiming);
        }
      }
    }),
});

const { updateServiceFlags } = pitStopAnalaysisSlice.actions;
export const { updateServiceStatus } = pitStopAnalaysisSlice.actions;

export const selectPitStopAnalysis = (state: RootState) =>
  state.pitStopAnalysis;

export const selectCurrentStopTiming = (state: RootState) =>
  state.pitStopAnalysis.currentStopTiming;

export const selectPastStopTiming = (state: RootState) =>
  state.pitStopAnalysis.pastStopTiming;

export const selectLastStopTiming = (state: RootState) => {
  const timing = selectPastStopTiming(state);
  return timing?.[timing.length - 1];
};

export const selectCurrentStopTimingSummary = (state: RootState) =>
  pitStopTimingSummary(selectCurrentStopTiming(state));

export const selectLastStopTimingSummary = (state: RootState) =>
  pitStopTimingSummary(selectLastStopTiming(state));

export const selectPitStopTimingSummary = (state: RootState) =>
  selectPastStopTiming(state).map(pitStopTimingSummary);

export const playerCarPitServiceFlagsDidChangePredicate: AppListenerPredicate =
  (_action, currentState, previousState) => {
    const currentServiceStatus = currentState.iRacing.data?.PitSvFlags || 0x0;
    const previousServiceStatus = previousState.iRacing.data?.PitSvFlags || 0x0;

    return currentServiceStatus !== previousServiceStatus;
  };

export const playerCarPitServiceFlagsDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  listenerApi.dispatch(
    updateServiceFlags({
      flags: currentState.iRacing.data?.PitSvFlags,
      sessionTime: currentState.iRacing.data?.SessionTime,
    }),
  );
};

// Listener for when the player pit service status changes
export const playerCarPitServiceStatusDidChangePredicate: AppListenerPredicate =
  (_action, currentState, previousState) => {
    const currentServiceStatus =
      currentState.iRacing.data?.PlayerCarPitSvStatus || PitServiceStatus.None;
    const previousServiceStatus =
      previousState.iRacing.data?.PlayerCarPitSvStatus || PitServiceStatus.None;

    return currentServiceStatus !== previousServiceStatus;
  };

export const playerCarPitServiceStatusDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const sessionTime = currentState.iRacing.data?.SessionTime;
  const currentStatus = currentState.iRacing.data?.PlayerCarPitSvStatus;
  const currentLap = currentState.iRacing.data?.Lap;

  listenerApi.dispatch(
    updateServiceStatus({
      status: currentStatus,
      lapNumber: currentLap,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: playerCarPitServiceStatusDidChangePredicate,
  effect: playerCarPitServiceStatusDidChangeEffect,
});

export default pitStopAnalaysisSlice.reducer;
