import { createSelector } from "@reduxjs/toolkit";
import { find, keyBy, groupBy } from "lodash";
import {
  Driver,
  PitServiceFlags,
  Session,
  SessionResultsPosition,
} from "../types";
import {
  getFastestLap,
  getSessionResultsPositions,
  getStrengthOfDrivers,
  sessionIsRaceSession,
} from "../utilities";
import { IRacingSocketState } from "./state";

export const selectIRacingSocketConnecting = (state: IRacingSocketState) =>
  state.isSocketConnecting;
export const selectIRacingSocketConnected = (state: IRacingSocketState) =>
  state.isSocketConnected;
export const selectIRacingServiceConnected = (state: IRacingSocketState) =>
  state.isIRacingConnected;

export const selectIRacingConnectionState = (state: IRacingSocketState) => ({
  isIRacingConnected: selectIRacingServiceConnected(state),
  isSocketConnected: selectIRacingSocketConnected(state),
  isConnecting: selectIRacingSocketConnecting(state),
});

export const selectIRacingData = (state: IRacingSocketState) => state.data;

export const selectIRacingSessionInfo = (state: IRacingSocketState) =>
  state.data?.SessionInfo;
export const selectIRacingSessions = (state: IRacingSocketState) =>
  state.data?.SessionInfo?.Sessions || [];

export const selectIsMulticlass = (state: IRacingSocketState) =>
  state.data?.WeekendInfo?.NumCarClasses > 1;

export const selectDriverInfo = (state: IRacingSocketState) =>
  state.data?.DriverInfo;

export const selectDriverInfoDrivers = (state: IRacingSocketState) =>
  state.data.DriverInfo?.Drivers || [];

export const selectSessionForSessionNumber = (
  state: IRacingSocketState,
  sessionNumber: number,
): Session | undefined => {
  const sessions = selectIRacingSessions(state);
  if (sessionNumber >= 0) {
    return sessions?.[sessionNumber] || undefined;
  }

  return undefined;
};

export const selectCurrentSession = (
  state: IRacingSocketState,
): Session | undefined =>
  selectSessionForSessionNumber(state, state.data?.SessionNum);

type ClassResultsIndex = Record<string, SessionResultsPosition[]>;

const selectResultsByClass = (
  results: SessionResultsPosition[],
  activeDrivers: Record<string, Driver[]>,
): ClassResultsIndex => {
  return Object.entries(activeDrivers).reduce((index, [classId, drivers]) => {
    const driverIndexes = drivers.map(({ CarIdx }) => CarIdx);
    return {
      ...index,
      [classId]: results.filter(({ CarIdx }) => driverIndexes.includes(CarIdx)),
    };
  }, {});
};

type ClassLeadersResultsIndex = Record<string, SessionResultsPosition>;

const selectClassLeadersFromResults = (
  classResults: ClassResultsIndex,
): ClassLeadersResultsIndex => {
  return Object.entries(classResults).reduce(
    (index, [classId, classPositions]) => ({
      ...index,
      [classId]: find(
        classPositions,
        ({ ClassPosition }) => ClassPosition === 0,
      ),
    }),
    {},
  );
};

export const selectResultsForSessionNumber = (
  state: IRacingSocketState,
  sessionNumber: number,
) => {
  const session = selectSessionForSessionNumber(state, sessionNumber);
  return getSessionResultsPositions(session);
};

export const selectResultsForSessionNumberByClass = (
  state: IRacingSocketState,
  sessionNumber: number,
) => {
  const results = selectResultsForSessionNumber(state, sessionNumber);
  const drivers = selectActiveDriversByCarClass(state, {
    includeAI: true,
    includePaceCar: false,
    includeSpectators: false,
  });

  return selectResultsByClass(results, drivers);
};

export const selectClassLeadersFromResultsForSessionNumber = (
  state: IRacingSocketState,
  sessionNumber: number,
) => {
  const classResults = selectResultsForSessionNumberByClass(
    state,
    sessionNumber,
  );
  return selectClassLeadersFromResults(classResults);
};

export const selectCurrentSessionResults = (state: IRacingSocketState) => {
  const currentSession = selectCurrentSession(state);
  return getSessionResultsPositions(currentSession);
};

export const selectCurrentSessionResultsByClass = (
  state: IRacingSocketState,
) => {
  const results = selectCurrentSessionResults(state);
  const drivers = selectActiveDriversByCarClass(state, {
    includeAI: true,
    includePaceCar: false,
    includeSpectators: false,
  });

  return selectResultsByClass(results, drivers);
};

export const selectCurrentSessionClassLeaders = (state: IRacingSocketState) => {
  const classResults = selectCurrentSessionResultsByClass(state);
  return selectClassLeadersFromResults(classResults);
};

export const selectCurrentSessionClassLeaderForCurrentDriverClass = (
  state: IRacingSocketState,
) => {
  const classLeaders = selectCurrentSessionClassLeaders(state);
  return classLeaders?.[state.data?.PlayerCarClass];
};

export const selectCurrentSessionIsRaceSession = (
  state: IRacingSocketState,
) => {
  const currentSession = selectCurrentSession(state);
  return sessionIsRaceSession(currentSession);
};

export const selectCurrentSessionFastestLap = (state: IRacingSocketState) => {
  const currentSession = selectCurrentSession(state);
  return currentSession.ResultsFastestLap?.[0];
};

export const selectCurrentSessionFastestLapTime = (state: IRacingSocketState) =>
  selectCurrentSessionFastestLap(state).FastestLap;

export const selectCurrentSessionFastestLapByClass = (
  state: IRacingSocketState,
) => {
  const results = selectCurrentSessionResultsByClass(state);
  return Object.entries(results).reduce(
    (index, [classId, classResults]) => ({
      ...index,
      [classId]: getFastestLap(classResults),
    }),
    {},
  );
};

export const selectTrackLengthKilometers = (state: IRacingSocketState) => {
  const trackLengthString = state.data?.WeekendInfo?.TrackLength;
  const parsedTrackLength = parseFloat(trackLengthString);
  if (!Number.isNaN(parsedTrackLength)) {
    return parsedTrackLength;
  } else {
    return undefined;
  }
};

export const selectTrackLengthMeters = (state: IRacingSocketState) => {
  const trackLengthKilometers = selectTrackLengthKilometers(state) || 0;
  return trackLengthKilometers * 1000;
};

export const selectP2PStatusForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxP2P_Status?.[driverIndex];

export const selectP2PCountForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxP2P_Count?.[driverIndex];

export const selectClassForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxClass?.[driverIndex];

export const selectTireCompoundForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxTireCompound?.[driverIndex];

export const selectClassPositionForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxClassPosition?.[driverIndex];

export const selectEstimatedTimeForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxEstTime?.[driverIndex];

export const selectF2TimeForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxF2Time?.[driverIndex];

export const selectLapForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxLap?.[driverIndex];

export const selectLapCompletedForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxLapCompleted?.[driverIndex];

export const selectPositionForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxPosition?.[driverIndex];

export const selectSteeringAngleForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxSteer?.[driverIndex];

export const selectIsOnPitRoadForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxOnPitRoad?.[driverIndex];

export const selectTrackSurfaceForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxTrackSurface?.[driverIndex];

export const selectTrackSurfaceMaterialForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxTrackSurfaceMaterial?.[driverIndex];

export const selectLapDistancePercentageForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxLapDistPct?.[driverIndex];

export const selectGearForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxGear?.[driverIndex];

export const selectRPMForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxRPM?.[driverIndex];

export const selectFlagsForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxSessionFlags?.[driverIndex];

export const selectFastRepairsUsedForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxFastRepairsUsed?.[driverIndex];

export const selectBestLapNumberForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxBestLapNum?.[driverIndex];

export const selectBestLapTimeForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxBestLapTime?.[driverIndex];

export const selectLastLapTimeForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxLastLapTime?.[driverIndex];

export const selectPaceFlagsForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxPaceFlags?.[driverIndex];

export const selectPaceLineForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxPaceLine?.[driverIndex];

export const selectPaceRowForDriverIndex = (
  state: IRacingSocketState,
  driverIndex: number,
) => state.data?.CarIdxPaceRow?.[driverIndex];

export interface FilterDriversResults {
  includeAI?: boolean;
  includePaceCar?: boolean;
  includeSpectators?: boolean;
}

export const filterDrivers = (
  drivers: Driver[],
  {
    includeAI = true,
    includePaceCar = true,
    includeSpectators = true,
  }: FilterDriversResults = {},
) =>
  drivers.filter(({ CarIsAI, CarIsPaceCar, IsSpectator }) => {
    if (!includeAI && CarIsAI) {
      return false;
    } else if (!includePaceCar && CarIsPaceCar) {
      return false;
    } else if (!includeSpectators && IsSpectator) {
      return false;
    }

    return true;
  });

export const selectCurrentDriverIndex = (state: IRacingSocketState) =>
  state.data.DriverInfo?.DriverCarIdx || -1;

export const selectDriverForIndex = (
  state: IRacingSocketState,
  carIndex: number,
) => {
  const activeDrivers = selectActiveDriversByCarIndex(state, {
    includeAI: false,
    includePaceCar: false,
  });

  return activeDrivers?.[carIndex];
};

export const selectCurrentDriver = (state: IRacingSocketState) => {
  const currentDriverIndex = selectCurrentDriverIndex(state);
  return selectDriverForIndex(state, currentDriverIndex);
};

export const selectCurrentDriverIsSpectator = (state: IRacingSocketState) => {
  const currentDriver = selectCurrentDriver(state);
  return currentDriver?.IsSpectator || false;
};

export const selectCurrentDriverCarClassContext = (
  state: IRacingSocketState,
) => {
  const {
    CarClassID,
    CarClassColor,
    CarClassDryTireSetLimit,
    CarClassEstLapTime,
    CarClassLicenseLevel,
    CarClassMaxFuelPct,
    CarClassPowerAdjust,
    CarClassWeightPenalty,
    CarClassRelSpeed,
    CarClassShortName,
  } = selectCurrentDriver(state);

  return {
    classId: CarClassID,
    color: CarClassColor,
    dryTireSetLimit: CarClassDryTireSetLimit,
    estimatedLapTime: CarClassEstLapTime,
    licenseLevel: CarClassLicenseLevel,
    maxFuelPercentage: CarClassMaxFuelPct,
    powerAdjustment: CarClassPowerAdjust,
    weightPenalty: CarClassWeightPenalty,
    relativeSpeed: CarClassRelSpeed,
    shortName: CarClassShortName,
  };
};

export const selectResultForCarIndex = createSelector(
  [selectCurrentSession, (_state, carIndex) => carIndex],
  (currentSession, carIndex) =>
    (currentSession?.ResultsPositions || []).find(
      ({ CarIdx }) => carIndex === CarIdx,
    ),
);

export const selectCurrentDriverResult = (state: IRacingSocketState) =>
  selectResultForCarIndex(state, state.data?.PlayerCarIdx);

export const selectActiveDrivers = createSelector(
  [
    selectDriverInfoDrivers,
    (
      _state,
      filters: FilterDriversResults = {
        includeAI: true,
        includePaceCar: true,
        includeSpectators: true,
      },
    ) => filters,
  ],
  (drivers, filters: FilterDriversResults) => filterDrivers(drivers, filters),
);

export const selectActiveDriversByCarIndex = createSelector(
  [selectActiveDrivers],
  (drivers) => keyBy(drivers, "CarIdx"),
);

export const selectActiveDriversByCarClass = createSelector(
  [selectActiveDrivers],
  (drivers) => groupBy(drivers, "CarClassID"),
);

export const selectActiveDriversByUserId = createSelector(
  [selectActiveDrivers],
  (drivers) => keyBy(drivers, "UserID"),
);

export const selectActiveDriversForClass = (
  state: IRacingSocketState,
  classId: string,
) => selectActiveDriversByCarClass(state)?.[classId];

export const selectIsTeamRacing = (state: IRacingSocketState): boolean =>
  !!state.data?.WeekendInfo?.TeamRacing;

export const selectStrengthOfField = (state: IRacingSocketState) => {
  const drivers = selectActiveDrivers(state, {
    includeAI: false,
    includePaceCar: false,
    includeSpectators: false,
  });

  return getStrengthOfDrivers(drivers);
};

export const selectStrengthOfFieldByClass = (state: IRacingSocketState) => {
  const driversByClass = selectActiveDriversByCarClass(state, {
    includeAI: false,
    includePaceCar: false,
    includeSpectators: false,
  });

  return Object.entries(driversByClass).reduce<Record<string, number>>(
    (index, [classId, drivers]) => {
      const classStrengthOfField = getStrengthOfDrivers(drivers);
      return {
        ...index,
        [classId]: classStrengthOfField,
      };
    },
    {},
  );
};

export interface PitServiceRequest {
  flags: PitServiceFlags;
  fuelLevel: number;
  leftFrontPressure: number;
  leftRearPressure: number;
  rightFrontPressure: number;
  rightRearPressure: number;
  tireCompound: number;

  tireSetsAvailable: number;
  tireSetsUsed: number;
  leftTireSetsAvailable: number;
  leftTireSetsUsed: number;
  rightTireSetsAvailable: number;
  rightTireSetsUsed: number;
  frontTireSetsAvailable: number;
  frontTireSetsUsed: number;
  rearTireSetsAvailable: number;
  rearTireSetsUsed: number;

  leftFrontTiresAvailable: number;
  leftFrontTiresUsed: number;
  rightFrontTiresAvailable: number;
  rightFrontTiresUsed: number;
  leftRearTiresAvailable: number;
  leftRearTiresUsed: number;
  rightRearTiresAvailable: number;
  rightRearTiresUsed: number;
}

export const selectPitServiceRequest: (
  state: IRacingSocketState,
) => PitServiceRequest = ({
  data: {
    PitSvFlags,
    PitSvFuel,
    PitSvLFP,
    PitSvRFP,
    PitSvLRP,
    PitSvRRP,
    PitSvTireCompound,
    TireSetsAvailable,
    TireSetsUsed,
    LeftTireSetsAvailable,
    LeftTireSetsUsed,
    RightTireSetsAvailable,
    RightTireSetsUsed,
    FrontTireSetsAvailable,
    FrontTireSetsUsed,
    RearTireSetsAvailable,
    RearTireSetsUsed,
    LFTiresAvailable,
    LFTiresUsed,
    LRTiresAvailable,
    LRTiresUsed,
    RFTiresAvailable,
    RFTiresUsed,
    RRTiresAvailable,
    RRTiresUsed,
  } = {},
}) => {
  return {
    flags: PitSvFlags,
    fuelLevel: PitSvFuel,
    leftFrontPressure: PitSvLFP,
    rightFrontPressure: PitSvRFP,
    leftRearPressure: PitSvLRP,
    rightRearPressure: PitSvRRP,
    tireCompound: PitSvTireCompound,
    tireSetsAvailable: TireSetsAvailable,
    tireSetsUsed: TireSetsUsed,
    leftTireSetsAvailable: LeftTireSetsAvailable,
    leftTireSetsUsed: LeftTireSetsUsed,
    rightTireSetsAvailable: RightTireSetsAvailable,
    rightTireSetsUsed: RightTireSetsUsed,
    frontTireSetsAvailable: FrontTireSetsAvailable,
    frontTireSetsUsed: FrontTireSetsUsed,
    rearTireSetsAvailable: RearTireSetsAvailable,
    rearTireSetsUsed: RearTireSetsUsed,
    leftFrontTiresAvailable: LFTiresAvailable,
    leftFrontTiresUsed: LFTiresUsed,
    leftRearTiresAvailable: LRTiresAvailable,
    leftRearTiresUsed: LRTiresUsed,
    rightFrontTiresAvailable: RFTiresAvailable,
    rightFrontTiresUsed: RFTiresUsed,
    rightRearTiresAvailable: RRTiresAvailable,
    rightRearTiresUsed: RRTiresUsed,
  };
};
