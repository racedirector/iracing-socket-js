import { useEffect, useState } from "react";
import { useIRacingContext } from "../context";
import { SessionResultsPosition } from "../../types";

export interface UseStandingsForCurrentSessionProps {}

export type UseStandingsForCurrentSessionResult = SessionResultsPosition[];

export type UseStandingsForCurrentSessionHook = (
  props?: Partial<UseStandingsForCurrentSessionProps>,
) => UseStandingsForCurrentSessionResult;

export const useStandingsForCurrentSession: UseStandingsForCurrentSessionHook =
  () => {
    const { data: { SessionNum: sessionNumber = -1 } = {} } =
      useIRacingContext();
    return useStandingsForSession({ sessionNumber });
  };

export interface UseStandingsForSessionProps {
  sessionNumber: number;
}

export type UseStandingsForSessionResult = UseStandingsForCurrentSessionResult;

export type UseStandingsForSessionHook = (
  props?: Partial<UseStandingsForSessionProps>,
) => UseStandingsForSessionResult;

export const useStandingsForSession: UseStandingsForSessionHook = ({
  sessionNumber,
}) => {
  const [standings, setStandings] = useState([]);
  const { data: { SessionInfo: { Sessions: sessions = [] } = {} } = {} } =
    useIRacingContext();

  useEffect(() => {
    if (sessionNumber >= 0) {
      const { ResultsPositions: currentSessionResults = [] } =
        sessions?.[sessionNumber] || {};

      setStandings(currentSessionResults);
    }
  }, [sessions, sessionNumber]);

  return standings;
};

export default useStandingsForSession;
