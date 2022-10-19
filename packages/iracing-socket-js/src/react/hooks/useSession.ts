import { useMemo } from "react";
import { find } from "lodash";
import { useIRacingContext } from "../context";
import { Session, SessionResultsPosition } from "../../types";
import { useDriverIndexesByClass } from "./useDrivers";
import { useDriversInCurrentDriverClass } from "./useDriver";
import { expectedRaceLengthForPositionData } from "../../utilities";

const sessionIsRaceSession = ({ SessionName }: Session) =>
  sessionNameIsRaceSession(SessionName);

const sessionNameIsRaceSession = (name: string) => name === "RACE";

export type UseSessionHook = (sessionNumber: number) => Session | undefined;

export const useSession: UseSessionHook = (sessionNumber) => {
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

export type UseSessionResultsHook = (
  sessionNumber: number,
) => SessionResultsPosition[];

export const useSessionResults: UseSessionResultsHook = (sessionNumber) => {
  const { ResultsPositions: resultsPositions = [] } =
    useSession(sessionNumber) || {};
  return resultsPositions;
};

export type UseSessionResultsByClassHook = (
  sessionNumber: number,
) => Record<string, SessionResultsPosition[]>;

export const useSessionResultsByClass: UseSessionResultsByClassHook = (
  sessionNumber,
) => {
  const results = useSessionResults(sessionNumber);
  const drivers = useDriverIndexesByClass();

  return useMemo(
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

type UseSessionSessionTimeHook = (session: Session) => number | null;

export const useSessionSessionTime: UseSessionSessionTimeHook = ({
  SessionTime: sessionTime,
}) => {
  return useMemo(() => {
    const value = parseInt(sessionTime);
    return Number.isNaN(value) ? null : value;
  }, [sessionTime]);
};

type UseSessionSessionLapsHook = (session: Session) => number | null;

export const useSessionSessionLaps: UseSessionSessionLapsHook = ({
  SessionLaps: sessionLaps,
}) => {
  return useMemo(() => {
    const value = parseInt(sessionLaps);
    return Number.isNaN(value) ? null : value;
  }, [sessionLaps]);
};

type UseSessionExpectedRaceLengthHook = (session: Session) => number | null;

export const useSessionExpectedRaceLength: UseSessionExpectedRaceLengthHook = ({
  ResultsPositions: results = [],
}) => {
  const session = useRaceSession();
  const raceSessionLength = useSessionSessionTime(session);
  const driverIndexesInClass = useDriversInCurrentDriverClass();

  return useMemo(() => {
    if (raceSessionLength > 0) {
      return expectedRaceLengthForPositionData(
        raceSessionLength,
        results,
        driverIndexesInClass,
      );
    }

    return null;
  }, [raceSessionLength, results, driverIndexesInClass]);
};

export type UseCurrentSessionHook = () => Session | undefined;

export const useCurrentSession: UseCurrentSessionHook = () => {
  const { data: { SessionNum: sessionNumber = -1 } = {} } = useIRacingContext();
  return useSession(sessionNumber);
};

export type UseCurrentSessionResultsHook = () => SessionResultsPosition[];

export const useCurrentSessionResults: UseCurrentSessionResultsHook = () => {
  const { ResultsPositions: resultsPositions } = useCurrentSession();
  return resultsPositions;
};

export type UseCurrentSessionResultsByClassHook = () => Record<
  string,
  SessionResultsPosition[]
>;

export const useCurrentSessionResultsByClass: UseCurrentSessionResultsByClassHook =
  () => {
    const results = useCurrentSessionResults();
    const drivers = useDriverIndexesByClass();

    return useMemo(() => {
      return Object.entries(drivers).reduce(
        (index, [classId, driverIndexes]) => {
          return {
            ...index,
            [classId]: results.filter(({ CarIdx }) =>
              driverIndexes.includes(CarIdx),
            ),
          };
        },
        {},
      );
    }, [results, drivers]);
  };

export type UseCurrentSessionIsRaceSessionHook = () => boolean;

export const useCurrentSessionIsRaceSession: UseCurrentSessionIsRaceSessionHook =
  () => {
    const { SessionName } = useCurrentSession();
    return useMemo(() => sessionNameIsRaceSession(SessionName), [SessionName]);
  };

export type UseRaceSessionHook = () => Session | undefined;

/**
 * Gets the most recent race session.
 * @returns The current session if it's a race session, otherwise the
 *          first session with `SessionName === "RACE"`, else undefined.
 */
export const useRaceSession: UseRaceSessionHook = () => {
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
