import { getContext, getContextKey } from "../../utils";
import { PitStopAnalysisState } from "../../features/pitStopAnalysisSlice";

export interface PitStopContextType extends PitStopAnalysisState {}

const DEFAULT_CONTEXT: PitStopContextType = {
  serviceStarted: false,
  serviceStartSessionTime: -1,
  stops: {},
};

const contextKey = getContextKey("__IRACING_PIT_STOP_ANALYSIS_CONTEXT__");

export const getPitStopContext = () => {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "PitStopContext";
  return context;
};

export { getPitStopContext as resetPitStopContext };
