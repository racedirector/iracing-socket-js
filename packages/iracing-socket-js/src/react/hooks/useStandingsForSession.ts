import { useEffect, useState } from "react";
import { useIRacingContext } from "../context";
import { SessionResultsPosition } from "../../types";
import useSession from "./useSession";

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
  const session = useSession(sessionNumber);

  useEffect(() => {
    if (session) {
      const { ResultsPositions: currentSessionResults = [] } = session;
      setStandings(currentSessionResults);
    }
  }, [session]);

  return standings;
};

export default useStandingsForSession;
