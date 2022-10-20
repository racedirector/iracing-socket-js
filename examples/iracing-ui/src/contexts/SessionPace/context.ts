import { createContext } from "react";
import { SessionPaceState } from "../../features/sessionPaceSlice";

export interface PaceContextType {
  topClassId?: string;
  index: SessionPaceState;
}

const DEFAULT_CONTEXT: PaceContextType = {
  topClassId: null,
  index: {},
};

const contextKey =
  typeof Symbol === "function" && typeof Symbol.for === "function"
    ? Symbol.for("__IRACING_PACE_CONTEXT__")
    : "__IRACING_PACE_CONTEXT__";

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
