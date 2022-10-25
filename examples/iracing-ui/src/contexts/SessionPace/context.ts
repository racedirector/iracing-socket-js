import { SessionPaceState } from "../../features/sessionPaceSlice";
import { getContext, getContextKey } from "../../utils";

export interface PaceContextType extends SessionPaceState {}

const DEFAULT_CONTEXT: PaceContextType = {};

const contextKey = getContextKey("__IRACING_SESSION_PACE_CONTEXT__");

export function getPaceContext(): React.Context<PaceContextType> {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "SessionPaceContext";
  return context;
}

export { getPaceContext as resetPaceContext };
