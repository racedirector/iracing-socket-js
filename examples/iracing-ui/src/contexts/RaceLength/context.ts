import { createContext } from "react";
import { RaceLengthState } from "src/features/raceLengthSlice";

export interface RaceLengthContextType extends RaceLengthState {
  totalLaps?: Record<string, number>;
  lapsRemaining: number;
  lapsComplete: number;
}

const DEFAULT_CONTEXT: RaceLengthContextType = {
  sessionLaps: 0,
  raceLaps: 0,
  lapsComplete: 0,
  lapsRemaining: -1,
  lengthInSeconds: "unlimited",
};

const contextKey =
  typeof Symbol === "function" && typeof Symbol.for === "function"
    ? Symbol.for("__IRACING_RACE_LENGTH_CONTEXT__")
    : "__IRACING_RACE_LENGTH_CONTEXT__";

export function getRaceLengthContext(): React.Context<RaceLengthContextType> {
  let context = (createContext as any)[
    contextKey
  ] as React.Context<RaceLengthContextType>;
  if (!context) {
    Object.defineProperty(createContext, contextKey, {
      value: (context = createContext<RaceLengthContextType>(DEFAULT_CONTEXT)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
    context.displayName = "RaceLengthContext";
  }
  return context;
}

export { getRaceLengthContext as resetRaceLengthContext };
