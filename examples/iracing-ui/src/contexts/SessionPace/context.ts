import { createContext } from "react";
import { SessionPaceState } from "../../features/sessionPaceSlice";
import { getContextKey } from "../../utils";

export interface PaceContextType extends SessionPaceState {}

const DEFAULT_CONTEXT: PaceContextType = {};

const contextKey = getContextKey("__IRACING_SESSION_PACE_CONTEXT__");

export function getPaceContext(): React.Context<PaceContextType> {
  let context = (createContext as any)[
    contextKey
  ] as React.Context<PaceContextType>;
  if (!context) {
    Object.defineProperty(createContext, contextKey, {
      value: (context = createContext<PaceContextType>(DEFAULT_CONTEXT)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
    context.displayName = "PaceContext";
  }
  return context;
}

export { getPaceContext as resetPaceContext };
