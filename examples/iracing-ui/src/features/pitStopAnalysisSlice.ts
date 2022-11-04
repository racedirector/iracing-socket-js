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

export interface PitStopAnalysisState {
  currentStopTiming: PitStopTiming;
  pastStopTiming: PitStopTiming[];
}

const initialState: PitStopAnalysisState = {
  currentStopTiming: {},
  pastStopTiming: [],
};

interface UpdateServiceStatePayload {
  status: PitServiceStatus;
  sessionTime: number;
  lapNumber: number;
}

export const pitStopAnalaysisSlice = createSlice({
  name: "pitStopAnalysis",
  initialState,
  reducers: {
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

export const { updateServiceStatus } = pitStopAnalaysisSlice.actions;

export const selectPitStopAnalysis = (state: RootState) =>
  state.pitStopAnalysis;

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

// startAppListening({
//   predicate: (_action, currentState, previousState) => {
//     const currentRequestedService =
//       currentState.iRacing.data?.PitSvFlags || 0x0;
//     const previousRequestedService =
//       previousState.iRacing.data?.PitSvFlags || 0x0;

//     // ???: Need to check what gets called as you request service...?
//     // ???: If i have tires checked and change pressures, does this still fire?

//     return currentRequestedService !== previousRequestedService;
//   },
//   effect: (_action, listenerApi) => {
//     const currentState = listenerApi.getState();
//     const requestedService = selectPitServiceRequest(currentState.iRacing);
//   },
// });

export default pitStopAnalaysisSlice.reducer;
