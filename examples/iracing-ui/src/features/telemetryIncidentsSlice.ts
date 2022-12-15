import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Flags,
  selectActiveDriversByCarIndex,
  selectFlagsForDriverIndex,
  selectGearForDriverIndex,
  selectLapDistancePercentageForDriverIndex,
  selectTrackLengthMeters,
  selectTrackSurfaceForDriverIndex,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { RootState } from "src/app/store";
import { AppListenerEffect, AppListenerPredicate } from "src/app/middleware";
import _, { isEmpty, isEqual } from "lodash";

interface TelemetryIncidentTelemetry {
  carIndex: number;
  isOnPitRoad: boolean;
  trackLocation: TrackLocation;
  lapPercentage: number;
  isInReverse: boolean;
  isOnTrack: boolean;
  flags: Flags;

  // Used for diffs/updates
  sessionTick: number;
  sessionTime: number;
}

interface TelemetryIncidentMeta {
  carIndex: number;
  isStationary: boolean;
  isSlow: boolean;
  isWrongWay: boolean;
  isReverse: boolean;
  isOnTrack: boolean;
  isOnPitRoad: boolean;
  isInWorld: boolean;
  lapPercentage: number;
  trackLocation: number;
}

const isSignificantMetaEvent = (
  oldMeta: TelemetryIncidentMeta,
  newMeta: TelemetryIncidentMeta,
): boolean => {
  // A transition from `oldMeta` to `newMeta` is significant if...
  return (
    // Detected track location change (approaching pits, off track, tow, etc)
    oldMeta.trackLocation !== newMeta.trackLocation ||
    // Change in stationary status
    oldMeta.isStationary !== newMeta.isStationary ||
    // Change in "is slow" status
    oldMeta.isSlow !== newMeta.isSlow ||
    // Change in direction
    oldMeta.isWrongWay !== newMeta.isWrongWay ||
    // Change in gear to/from reverse
    oldMeta.isReverse !== newMeta.isReverse ||
    // Change on/off pit road
    oldMeta.isOnPitRoad !== newMeta.isOnPitRoad
  );
};

export enum TelemetryIncidentReason {
  ReversingOnTrack = "reversingOnTrack",
  ReversingOffTrack = "reversingOffTrack",
  StationaryOnTrack = "stationaryOnTrack",
  StationaryOffTrack = "stationaryOffTrack",
  SlowCarOnTrack = "slowCarOnTrack",
  CarGoingWrongWayOnTrack = "carGoingWrongWayOnTrack",
}

export interface TelemetryIncidentEvent {
  reason: TelemetryIncidentReason;
}

export interface TelemetryIncidentsWeightConfig {
  stationaryCar: number;
  stationaryCarOnTrack: number;
  reversingCar: number;
  reversingCarOnTrack: number;
  slowCar: number;
  slowCarOnTrack: number;
  carGoingWrongWayOnTrack: number;
  strandedCar: number;
}

export interface TelemetryIncidentsState {
  config: TelemetryIncidentsWeightConfig;
  incidents: TelemetryIncidentEvent[];
  telemetryState: Record<string, TelemetryIncidentMeta>;
}

const initialState: TelemetryIncidentsState = {
  config: {
    stationaryCar: 0,
    stationaryCarOnTrack: 0,
    reversingCar: 0,
    reversingCarOnTrack: 0,
    slowCar: 0,
    slowCarOnTrack: 0,
    carGoingWrongWayOnTrack: 0,
    strandedCar: 0,
  },
  incidents: [],
  telemetryState: {},
};

interface SetTelemetryStateForCarIndexPayload {
  carIndex: string;
  telemetryMeta: TelemetryIncidentMeta;
}

export const telemetryIncidentsSlice = createSlice({
  name: "telemetryIncidents",
  initialState,
  reducers: {
    setConfig: (
      state,
      action: PayloadAction<Partial<TelemetryIncidentsWeightConfig>>,
    ) => {
      state.config = {
        ...state.config,
        ...action.payload,
      };
    },
    setTelemetryStateForCarIndex: (
      state,
      action: PayloadAction<SetTelemetryStateForCarIndexPayload>,
    ) => {
      state.telemetryState = {
        [action.payload.carIndex]: action.payload.telemetryMeta,
      };
    },
  },
});

export const { setConfig, setTelemetryStateForCarIndex } =
  telemetryIncidentsSlice.actions;

// export const selectTelemetryIncidents = (state: RootState) =>
//   state.telemetryIncidents;

// export const selectTelemetryForDriverIndex = (
//   state: RootState,
//   driverIndex: number,
// ): TelemetryIncidentTelemetry => {
//   const iRacingData = state.iRacing;
//   const trackLocation = selectTrackSurfaceForDriverIndex(
//     iRacingData,
//     driverIndex,
//   );
//   const lapDistance = selectLapDistancePercentageForDriverIndex(
//     iRacingData,
//     driverIndex,
//   );
//   const currentGear = selectGearForDriverIndex(iRacingData, driverIndex);
//   const currentFlags = selectFlagsForDriverIndex(iRacingData, driverIndex);

//   const isOnTrack = trackLocation > TrackLocation.OffTrack;
//   const isOnPitRoad =
//     trackLocation === TrackLocation.ApproachingPits ||
//     trackLocation === TrackLocation.InPitStall;
//   return {
//     trackLocation,
//     isOnPitRoad,
//     isOnTrack,
//     carIndex: driverIndex,
//     flags: currentFlags,
//     lapPercentage: lapDistance,
//     isInReverse: currentGear === -1,
//     sessionTick: iRacingData.data?.SessionTick,
//     sessionTime: iRacingData.data?.SessionTime,
//   };
// };

export const isCarSlow = (
  currentLapDistancePercentage: number,
  previousLapDistancePercentage: number,
  trackLength: number,
  threshold = 5,
) => {
  const currentLapDistance = currentLapDistancePercentage * trackLength;
  const previousLapDistance = previousLapDistancePercentage * trackLength;
  const distanceDelta = Math.abs(currentLapDistance - previousLapDistance);
  return threshold > distanceDelta;
};

export const isCarStationary = (
  currentLapDistancePercentage: number,
  previousLapDistancePercentage: number,
  trackLength: number,
  isOnPitRoad: boolean,
) => {
  const currentLapDistance = Math.round(
    currentLapDistancePercentage * trackLength,
  );
  const previousLapDistance = Math.round(
    previousLapDistancePercentage * trackLength,
  );

  return currentLapDistance === previousLapDistance && !isOnPitRoad;
};

export const isCarGoingWrongWay = (
  currentLapDistancePercentage: number,
  previousLapDistancePercentage: number,
  trackLength: number,
) => {
  const currentLapDistance = currentLapDistancePercentage * trackLength;
  const previousLapDistance = previousLapDistancePercentage * trackLength;
  const distanceDelta = currentLapDistance - previousLapDistance;
  return distanceDelta < 0 && distanceDelta > -100;
};

export const getTelemetryIncidentsMeta: (
  currentTelemetry: TelemetryIncidentTelemetry,
  previousTelemetry: TelemetryIncidentTelemetry,
  trackLength: number,
  slowCarThreshold: number,
) => TelemetryIncidentMeta = (
  currentTelemetry,
  previousTelemetry,
  trackLength,
  slowCarThreshold,
) => ({
  carIndex: currentTelemetry.carIndex,
  trackLocation: currentTelemetry.trackLocation,
  isStationary: isCarStationary(
    currentTelemetry.lapPercentage,
    previousTelemetry.lapPercentage,
    trackLength,
    currentTelemetry.isOnPitRoad,
  ),
  isSlow: isCarSlow(
    currentTelemetry.lapPercentage,
    previousTelemetry.lapPercentage,
    trackLength,
    slowCarThreshold,
  ),
  isWrongWay: isCarGoingWrongWay(
    currentTelemetry.lapPercentage,
    previousTelemetry.lapPercentage,
    trackLength,
  ),
  lapPercentage: currentTelemetry.lapPercentage,
  isReverse: currentTelemetry.isInReverse,
  isOnTrack: currentTelemetry.isOnTrack,
  isOnPitRoad: currentTelemetry.isOnPitRoad,
  isInWorld: currentTelemetry.trackLocation > TrackLocation.NotInWorld,
});

export const telemetryEventIsSignificant: (
  meta: TelemetryIncidentMeta,
) => boolean = ({
  isStationary,
  isReverse,
  isSlow,
  isWrongWay,
  isOnTrack: telemetryIsOnTrack,
  isOnPitRoad,
  isInWorld,
  trackLocation,
}) => {
  const isSignificant =
    isStationary ||
    (isSlow && trackLocation !== TrackLocation.ApproachingPits) ||
    (isWrongWay && telemetryIsOnTrack) ||
    isReverse;

  return isInWorld && !isOnPitRoad && isSignificant;
};

const telemetryIncidentsDriversFilters = {
  includeAI: true,
  includePaceCar: false,
  includeSpectators: false,
};

// export const checkTelemetryIncidentsEffect: AppListenerEffect = (
//   _action,
//   listenerApi,
// ) => {
//   const currentState = listenerApi.getState();
//   const previousState = listenerApi.getOriginalState();

//   const trackLength = selectTrackLengthMeters(currentState.iRacing);

//   const currentDriversIndex = selectActiveDriversByCarIndex(
//     currentState.iRacing,
//     telemetryIncidentsDriversFilters,
//   );
//   const previousDriversIndex = selectActiveDriversByCarIndex(
//     previousState.iRacing,
//     telemetryIncidentsDriversFilters,
//   );

//   Object.entries(currentDriversIndex).forEach(([carIndex, driver]) => {
//     const normalizedCarIndex = parseInt(carIndex);
//     if (!normalizedCarIndex) {
//       return;
//     }

//     const currentTelemetry = selectTelemetryForDriverIndex(
//       currentState,
//       normalizedCarIndex,
//     );

//     const previousTelemetry = selectTelemetryForDriverIndex(
//       previousState,
//       normalizedCarIndex,
//     );

//     const previousChangeMeta =
//       currentState.telemetryIncidents.telemetryState[carIndex];
//     const telemetryChangeMeta = getTelemetryIncidentsMeta(
//       currentTelemetry,
//       previousTelemetry,
//       trackLength,
//       5,
//     );

//     if (!previousChangeMeta) {
//       listenerApi.dispatch(
//         setTelemetryStateForCarIndex({
//           carIndex,
//           telemetryMeta: telemetryChangeMeta,
//         }),
//       );
//     } else if (
//       isSignificantMetaEvent(telemetryChangeMeta, previousChangeMeta)
//     ) {
//     }
//   });
// };

// export const carsInReversePredicate: AppListenerPredicate = (
//   _action,
//   currentState,
//   previousState,
// ) => {
//   const currentIsOnPitRoad = currentState.iRacing.data?.CarIdxOnPitRoad;
//   const currentGearsByCarIndex = currentState.iRacing.data?.CarIdxGear;
//   const previousGearsByCarIndex = previousState.iRacing.data?.CarIdxGear;

//   for (let carIndex = 0; carIndex < currentGearsByCarIndex.length; carIndex++) {
//     const currentGear = currentGearsByCarIndex[carIndex];
//     const previousGear = previousGearsByCarIndex[carIndex];
//     const isOnPitRoad = currentIsOnPitRoad[carIndex];

//     if (currentGear === -1 && currentGear !== previousGear && !isOnPitRoad) {
//       return true;
//     }
//   }

//   return false;
// };

// export const carIsStationaryPredicate: AppListenerPredicate = (
//   _action,
//   currentState,
//   previousState,
// ) => {
//   const currentIsOnPitRoad = currentState.iRacing.data?.CarIdxOnPitRoad;
//   const currentLapDistancePercentages =
//     currentState.iRacing.data?.CarIdxLapDistPct;
//   const previousLapDistancePercentages =
//     previousState.iRacing.data?.CarIdxLapDistPct;

//   for (
//     let carIndex = 0;
//     carIndex < currentLapDistancePercentages.length;
//     carIndex++
//   ) {
//     const currentPercentage = currentLapDistancePercentages[carIndex];
//     const previousPercentage = previousLapDistancePercentages[carIndex];
//     const isOnPitRoad = currentIsOnPitRoad[carIndex];

//     if (
//       Math.round(currentPercentage) === Math.round(previousPercentage) &&
//       !isOnPitRoad
//     ) {
//       return true;
//     }
//   }

//   return false;
// };

// export const carIsInReverseEffect: AppListenerEffect = (
//   _action,
//   listenerApi,
// ) => {
//   console.log(
//     "Establishing the car indexes of all cars that have transitioned to reverse",
//   );
//   const currentState = listenerApi.getState();
//   const previousState = listenerApi.getOriginalState();

//   const currentIsOnPitRoad = currentState.iRacing.data?.CarIdxOnPitRoad;
//   const currentGearsByCarIndex = currentState.iRacing.data?.CarIdxGear;
//   const previousGearsByCarIndex = previousState.iRacing.data?.CarIdxGear;

//   const carIndexesTransitionedToReverse: number[] = [];
//   for (let carIndex = 0; carIndex < currentGearsByCarIndex.length; carIndex++) {
//     const currentGear = currentGearsByCarIndex[carIndex];
//     const previousGear = previousGearsByCarIndex[carIndex];
//     const isOnPitRoad = currentIsOnPitRoad[carIndex];

//     if (currentGear === -1 && currentGear !== previousGear && !isOnPitRoad) {
//       carIndexesTransitionedToReverse.push(carIndex);
//     }
//   }

//   if (!isEmpty(carIndexesTransitionedToReverse)) {
//     console.log(
//       "These cars are in reverse on track or something:",
//       carIndexesTransitionedToReverse,
//     );
//   }
// };

// export const carIsStationaryEffect: AppListenerEffect = (
//   _action,
//   listenerApi,
// ) => {
//   const currentState = listenerApi.getState();
//   const previousState = listenerApi.getOriginalState();

//   const currentIsOnPitRoad = currentState.iRacing.data?.CarIdxOnPitRoad;
//   const currentLapDistancePercentages =
//     currentState.iRacing.data?.CarIdxLapDistPct;
//   const previousLapDistancePercentages =
//     previousState.iRacing.data?.CarIdxLapDistPct;

//   const stationaryCarIndexes: number[] = [];
//   for (
//     let carIndex = 0;
//     carIndex < currentLapDistancePercentages.length;
//     carIndex++
//   ) {
//     const currentPercentage = currentLapDistancePercentages[carIndex];
//     const previousPercentage = previousLapDistancePercentages[carIndex];
//     const isOnPitRoad = currentIsOnPitRoad[carIndex];

//     if (
//       Math.round(currentPercentage) === Math.round(previousPercentage) &&
//       !isOnPitRoad
//     ) {
//       stationaryCarIndexes.push(carIndex);
//     }
//   }
// };

// startAppListening({
//   predicate: sessionTickDidChangePredicate,
//   effect: checkTelemetryIncidentsEffect,
// });

export default telemetryIncidentsSlice.reducer;
