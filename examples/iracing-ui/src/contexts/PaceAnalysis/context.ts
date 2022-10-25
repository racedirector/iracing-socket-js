import { getContext, getContextKey } from "../../utils";
import { PaceAnalysisState } from "../../features/paceAnalysisSlice";

export interface PaceAnalysisContextType extends PaceAnalysisState {}

const DEFAULT_CONTEXT: PaceAnalysisContextType = {
  lapTimeLimit: 5,
  targetLapTimes: {},
};

const contextKey = getContextKey("__IRACING_PACE_ANALYSIS_CONTEXT__");

export function getPaceAnalysisContext(): React.Context<PaceAnalysisContextType> {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "PaceAnalysisContext";
  return context;
}

export { getPaceAnalysisContext as resetPaceAnalysisContext };
