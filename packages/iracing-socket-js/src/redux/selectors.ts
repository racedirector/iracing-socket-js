import { find, keyBy, groupBy } from "lodash";
import {
  Driver,
  PitServiceFlags,
  Session,
  SessionResultsPosition,
} from "../types";
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

export const selectCurrentSession = (state: IRacingSocketState) => {
  const sessionNumber = state.data?.SessionNum || -1;
  return selectSessionForSessionNumber(state, sessionNumber);
};

export const selectSessionIsRaceSession = (session: Session) =>
  session?.SessionName === "RACE";

export const selectSessionTime = ({
  SessionTime: sessionTime = "unknown",
}: Session) => {
  if (sessionTime === "unlimited") {
    return sessionTime;
  }

  const totalTime = parseInt(sessionTime);
  return Number.isNaN(totalTime) ? null : totalTime;
};

export const selectSessionLaps = ({
  SessionLaps: sessionLaps = "unknown",
}: Session) => {
  const lapCount = parseInt(sessionLaps);
  return Number.isNaN(lapCount) ? null : lapCount;
};

export const selectSessionResultsPositions = (session: Session) => {
  return session?.ResultsPositions || [];
};

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
  return selectSessionResultsPositions(session);
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
  return selectSessionResultsPositions(currentSession);
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

export const selectCurrentSessionIsRaceSession = (
  state: IRacingSocketState,
) => {
  const currentSession = selectCurrentSession(state);
  return selectSessionIsRaceSession(currentSession);
};

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

export const selectCurrentDriver = (state: IRacingSocketState) => {
  const currentDriverIndex = selectCurrentDriverIndex(state);
  const activeDrivers = selectActiveDriversByCarIndex(state, {
    includeAI: false,
    includePaceCar: false,
  });

  return activeDrivers?.[currentDriverIndex];
};

export const selectActiveDrivers = (
  state: IRacingSocketState,
  filters: FilterDriversResults = {
    includeAI: true,
    includePaceCar: true,
    includeSpectators: true,
  },
) => filterDrivers(state.data?.DriverInfo?.Drivers || [], filters);

export const selectActiveDriversByCarIndex = (
  state: IRacingSocketState,
  filters?: FilterDriversResults,
) => keyBy(selectActiveDrivers(state, filters), "CarIdx");

export const selectActiveDriversByCarClass = (
  state: IRacingSocketState,
  filters?: FilterDriversResults,
) => groupBy(selectActiveDrivers(state, filters), "CarClassID");

export const selectActiveDriversForClass = (
  state: IRacingSocketState,
  classId: string,
) => selectActiveDriversByCarClass(state)?.[classId];

const MAGIC_NUMBER = 1600;
const getStrengthOfDrivers = (drivers: Driver[]) => {
  const total = drivers.reduce(
    (totalIRating, { IRating }) =>
      totalIRating + Math.pow(2, -IRating / MAGIC_NUMBER),
    0,
  );

  const strength =
    (MAGIC_NUMBER / Math.log(2)) * Math.log(drivers.length / total);

  return strength / 1000;
};

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
}

export const selectPitServiceRequest = (
  state: IRacingSocketState,
): PitServiceRequest => {
  const {
    PitSvFlags,
    PitSvFuel,
    PitSvLFP,
    PitSvRFP,
    PitSvLRP,
    PitSvRRP,
    PitSvTireCompound,
  } = state.data;

  return {
    flags: PitSvFlags,
    fuelLevel: PitSvFuel,
    leftFrontPressure: PitSvLFP,
    rightFrontPressure: PitSvRFP,
    leftRearPressure: PitSvLRP,
    rightRearPressure: PitSvRRP,
    tireCompound: PitSvTireCompound,
  };
};
