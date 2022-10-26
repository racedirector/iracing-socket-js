import { getContext, getContextKey } from "../../utils";
import { PitStopAnalysisState } from "../../features/pitStopAnalysisSlice";
import {
  PitServiceStatus,
  TrackLocation,
} from "@racedirector/iracing-socket-js";

export interface PitStopAnalysisContextType extends PitStopAnalysisState {}

const DEFAULT_CONTEXT: PitStopAnalysisContextType = {
  serviceState: PitServiceStatus.None,
  playerTrackLocation: TrackLocation.NotInWorld,
  nextServiceRequest: {
    service: 0x0,
    fuelAmount: -1,
  },
  currentStopTiming: {},
  pastStopTiming: [],
};

const contextKey = getContextKey("__IRACING_PIT_STOP_ANALYSIS_CONTEXT__");

export const getPitStopAnalysisContext = () => {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "PitStopContext";
  return context;
};

export { getPitStopAnalysisContext as resetPitStopAnalysisContext };
