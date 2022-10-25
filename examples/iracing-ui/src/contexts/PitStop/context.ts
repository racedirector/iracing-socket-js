import { createContext } from "react";
import { getContextKey } from "../../utils";
import { PitStopState } from "../../features/PitStopSlice";

export interface PitStopContextType extends PitStopState {}

const DEFAULT_CONTEXT: PitStopContextType = {
  lapTimeLimit: 5,
  targetLapTimes: {},
};

const contextKey = getContextKey("__IRACING_PIT_STOP_ANALYSIS_CONTEXT__");

export function getPitStopContext(): React.Context<PitStopContextType> {
  let context = (createContext as any)[
    contextKey
  ] as React.Context<PitStopContextType>;
  if (!context) {
    Object.defineProperty(createContext, contextKey, {
      value: (context = createContext<PitStopContextType>(DEFAULT_CONTEXT)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
    context.displayName = "PitStopContext";
  }
  return context;
}

export { getPitStopContext as resetPitStopContext };
