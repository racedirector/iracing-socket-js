import { getContextKey } from "../../utils";

export interface RaceStrategyContextType {}

const DEFAULT_CONTEXT: RaceStrategyContextType = {};

const contextKey = getContextKey("__IRACING_RACE_STRATEGY_CONTEXT__");

export function getRaceStrategyContext(): React.Context<RaceStrategyContextType> {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "RaceStrategyContext";
  return context;
}

export { getRaceStrategyContext as resetRaceStrategyContext };
