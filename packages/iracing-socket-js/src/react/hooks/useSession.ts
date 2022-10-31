import { useMemo } from "react";
import { find, isEmpty } from "lodash";
import { useIRacingContext } from "../context";
import { RaceTime, Session, SessionResultsPosition } from "../../types";
import { useDriverIndexesByClass } from "./useDrivers";
import { useCurrentDriver, useDriversInCurrentDriverClass } from "./useDriver";
import {
  expectedRaceLengthForPositionData,
  getFastestLap,
} from "../../utilities";

const sessionIsRaceSession = ({ SessionName = "" }: Session) =>
  sessionNameIsRaceSession(SessionName);

const sessionNameIsRaceSession = (name: string) => name === "RACE";

export const useSession = (sessionNumber) => {
  const { data: { SessionInfo: { Sessions: sessions = [] } = {} } = {} } =
    useIRacingContext();

  const session = useMemo(() => {
    if (sessionNumber >= 0) {
      return sessions?.[sessionNumber] || undefined;
    }

    return undefined;
  }, [sessionNumber, sessions]);

  return session;
};

export const useSessionResultsByClass = (sessionNumber: number) => {
  const { ResultsPositions: results = [] } = useSession(sessionNumber) || {};
  const drivers = useDriverIndexesByClass();

  return useMemo<Record<string, SessionResultsPosition[]>>(
    () =>
      Object.entries(drivers).reduce((index, [classId, driverIndexes]) => {
        return {
          ...index,
          [classId]: results.filter(({ CarIdx }) =>
            driverIndexes.includes(CarIdx),
          ),
        };
      }, {}),
    [results, drivers],
  );
};

type UseSessionSessionTimeHook = (session: Session) => RaceTime | null;

export const useSessionSessionTime: UseSessionSessionTimeHook = ({
  SessionTime: sessionTime,
}) => {
  return useMemo(() => {
    if (sessionTime === "unlimited") {
      return sessionTime;
    }

    const value = parseInt(sessionTime);
    return Number.isNaN(value) ? null : value;
  }, [sessionTime]);
};

export const useSessionSessionLaps = ({ SessionLaps: sessionLaps }) => {
  return useMemo(() => {
    const value = parseInt(sessionLaps);
    return Number.isNaN(value) ? null : value;
  }, [sessionLaps]);
};

export const useSessionExpectedRaceLength = ({
  ResultsPositions: results = [],
}) => {
  const session = useRaceSession();
  const raceSessionLength = useSessionSessionTime(session);
  const driverIndexesInClass = useDriversInCurrentDriverClass();

  return useMemo(() => {
    if (typeof raceSessionLength === "number" && raceSessionLength > 0) {
      return expectedRaceLengthForPositionData(
        raceSessionLength,
        results,
        driverIndexesInClass,
      );
    }

    return null;
  }, [raceSessionLength, results, driverIndexesInClass]);
};

export const useCurrentSession = () => {
  const { data: { SessionNum: sessionNumber = -1 } = {} } = useIRacingContext();
  return useSession(sessionNumber);
};

export const useCurrentSessionResultsByClass = () => {
  const { ResultsPositions: results } = useCurrentSession() || {};
  const drivers = useDriverIndexesByClass();

  return useMemo<Record<string, SessionResultsPosition[]>>(() => {
    return !isEmpty(results)
      ? Object.entries(drivers).reduce((index, [classId, driverIndexes]) => {
          return {
            ...index,
            [classId]: results.filter(({ CarIdx }) =>
              driverIndexes.includes(CarIdx),
            ),
          };
        }, {})
      : {};
  }, [results, drivers]);
};

export const useCurrentSessionClassLeaders = () => {
  const classResults = useCurrentSessionResultsByClass();

  return useMemo<Record<string, SessionResultsPosition>>(
    () =>
      Object.entries(classResults).reduce(
        (index, [classId, classPositions]) => {
          return {
            ...index,
            [classId]: find(
              classPositions,
              ({ ClassPosition }) => ClassPosition === 0,
            ),
          };
        },
        {},
      ),
    [classResults],
  );
};

export const useCurrentSessionFastestLap = () => {
  const { ResultsPositions: results } = useCurrentSession() || {};
  return getFastestLap(results);
};

export const useCurrentSessionClassFastestLap = () => {
  const classResults = useCurrentSessionResultsByClass();
  return useMemo<Record<string, number>>(
    () =>
      Object.entries(classResults).reduce(
        (index, [classId, classResults]) => ({
          ...index,
          [classId]: getFastestLap(classResults),
        }),
        {},
      ),
    [classResults],
  );
};

export const useCurrentDriverResult = () => {
  const { ResultsPositions: results = [] } = useCurrentSession() || {};
  const { CarIdx: driverCarIndex = null } = useCurrentDriver() || {};
  return useMemo(
    () =>
      driverCarIndex &&
      find(results, ({ CarIdx }) => CarIdx === driverCarIndex),
    [results, driverCarIndex],
  );
};

export type UseCurrentSessionIsRaceSessionHook = () => boolean;

export const useCurrentSessionIsRaceSession: UseCurrentSessionIsRaceSessionHook =
  () => {
    const { SessionName = "" } = useCurrentSession() || {};
    return useMemo(() => sessionNameIsRaceSession(SessionName), [SessionName]);
  };

/**
 * Gets the most recent race session.
 * @returns The current session if it's a race session, otherwise the
 *          first session with `SessionName === "RACE"`, else undefined.
 */
export const useRaceSession = () => {
  const {
    data: {
      SessionNum: sessionNumber = -1,
      SessionInfo: { Sessions: sessions = [] } = {},
    } = {},
  } = useIRacingContext();

  return useMemo(() => {
    if (sessionNumber >= 0) {
      const currentSession = sessions?.[sessionNumber] || undefined;
      if (sessionIsRaceSession(currentSession)) {
        return currentSession;
      }
    }

    // ???: Search through sessions to find the frist race session?
    // I think this has to do with heat racing or something with warm
    // up to make sure that the estimations persist between sessions...
    return find(sessions, sessionIsRaceSession);
  }, [sessionNumber, sessions]);
};
