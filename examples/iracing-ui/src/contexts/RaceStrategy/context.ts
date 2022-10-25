import { createContext } from "react";
import { getContextKey } from "../../utils";

export interface RaceStrategyContextType {}

const DEFAULT_CONTEXT: RaceStrategyContextType = {};

const contextKey = getContextKey("__IRACING_RACE_STRATEGY_CONTEXT__");

export function getRaceStrategyContext(): React.Context<RaceStrategyContextType> {
  let context = (createContext as any)[
    contextKey
  ] as React.Context<RaceStrategyContextType>;
  if (!context) {
    Object.defineProperty(createContext, contextKey, {
      value: (context =
        createContext<RaceStrategyContextType>(DEFAULT_CONTEXT)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
    context.displayName = "RaceStrategyContext";
  }
  return context;
}

export { getRaceStrategyContext as resetRaceStrategyContext };
