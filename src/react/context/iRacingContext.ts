import * as React from "react";
import { iRacingSocket } from "../../core";

export interface iRacingContextType {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  socket?: iRacingSocket;
}

const DEFAULT_CONTEXT: iRacingContextType = {
  isSocketConnected: false,
  isIRacingConnected: false,
};

export const iRacingContext =
  React.createContext<iRacingContextType>(DEFAULT_CONTEXT);
iRacingContext.displayName = "iRacingContext";

export const useIRacingContext = () => React.useContext(iRacingContext);
