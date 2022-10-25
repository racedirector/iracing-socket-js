import { createContext } from "react";
import { getContextKey } from "../../utils";
import { PaceAnalysisState } from "../../features/paceAnalysisSlice";

export interface PaceAnalysisContextType extends PaceAnalysisState {}

const DEFAULT_CONTEXT: PaceAnalysisContextType = {
  lapTimeLimit: 5,
  targetLapTimes: {},
};

const contextKey = getContextKey("__IRACING_PACE_ANALYSIS_CONTEXT__");

export function getPaceAnalysisContext(): React.Context<PaceAnalysisContextType> {
  let context = (createContext as any)[
    contextKey
  ] as React.Context<PaceAnalysisContextType>;
  if (!context) {
    Object.defineProperty(createContext, contextKey, {
      value: (context =
        createContext<PaceAnalysisContextType>(DEFAULT_CONTEXT)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
    context.displayName = "PaceAnalysisContext";
  }
  return context;
}

export { getPaceAnalysisContext as resetPaceAnalysisContext };
