import React, { PropsWithChildren, useEffect } from "react";
import { useCurrentSession } from "@racedirector/iracing-socket-js";
import { find, isEmpty } from "lodash";
import usePrevious from "../../hooks/usePrevious";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addTargetLapTimes,
  selectPaceAnalysis,
} from "../../features/paceAnalysisSlice";
import { getPaceAnalysisContext } from "./context";

export interface PaceAnalysisProviderProps {}

export const PaceAnalysisProvider: React.FC<
  PropsWithChildren<PaceAnalysisProviderProps>
> = ({ children = null }) => {
  const PaceAnalysisContext = getPaceAnalysisContext();
  const state = useAppSelector(selectPaceAnalysis);
  const dispatch = useAppDispatch();
  const { ResultsPositions: resultsPositions = [] } = useCurrentSession() || {};
  const previousResults = usePrevious(resultsPositions);

  useEffect(() => {
    const newResults = (resultsPositions || [])
      .filter(({ CarIdx, LapsComplete }) => {
        const previousResult = find(
          previousResults,
          ({ CarIdx: resultCarIndex }) => resultCarIndex === CarIdx,
        );

        return !previousResult || LapsComplete > previousResult.LapsComplete;
      })
      .reduce((index, { CarIdx, LastTime }) => {
        return LastTime >= 0 ? { ...index, [CarIdx]: LastTime } : index;
      }, {});

    if (!isEmpty(newResults)) {
      dispatch(addTargetLapTimes(newResults));
    }
  }, [resultsPositions, previousResults, dispatch]);

  return (
    <PaceAnalysisContext.Provider value={state}>
      {children}
    </PaceAnalysisContext.Provider>
  );
};

export default PaceAnalysisProvider;
