import * as React from "react";
import { canUseSymbol } from "../../utilities";
import { iRacingSocket } from "../../core";
import { iRacingData } from "../../types";

export interface iRacingContextType {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  socket?: iRacingSocket;
  data?: iRacingData;
}

const DEFAULT_CONTEXT: iRacingContextType = {
  isSocketConnected: false,
  isIRacingConnected: false,
};

const contextKey = canUseSymbol ? Symbol.for("__IRACING__") : "__IRACING__";

export const getIRacingContext: () => React.Context<iRacingContextType> =
  () => {
    let context = (React.createContext as any)[
      contextKey
    ] as React.Context<iRacingContextType>;

    if (!context) {
      Object.defineProperty(React.createContext, contextKey, {
        value: (context =
          React.createContext<iRacingContextType>(DEFAULT_CONTEXT)),
        enumerable: false,
        writable: false,
        configurable: true,
      });

      context.displayName = "iRacingContext";
    }

    return context;
  };

export { getIRacingContext as resetIRacingContext };
