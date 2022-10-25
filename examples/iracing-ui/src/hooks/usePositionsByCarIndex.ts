import {
  SessionResultsPosition,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { chain, isEmpty } from "lodash";
import { useMemo } from "react";

interface PositionsByCarIndex {
  [sessionNumber: string]: Record<string, SessionResultsPosition>;
}

export const usePositionsByCarIndex = () => {
  const { data: { SessionInfo: { Sessions: sessions = [] } = {} } = {} } =
    useIRacingContext();

  const index: PositionsByCarIndex = useMemo(() => {
    return sessions.reduce(
      (positionIndex, { ResultsPositions: positions = [] }, sessionNumber) => {
        if (!positions || isEmpty(positions)) {
          return positionIndex;
        }

        return {
          ...positionIndex,
          [sessionNumber]: chain(positions).keyBy("CarIdx").valueOf(),
        };
      },
      {},
    );
  }, [sessions]);

  return index;
};

export default usePositionsByCarIndex;
