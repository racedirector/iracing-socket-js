import * as React from "react";
import { iRacingSocket } from "../../core";
import { iRacingData } from "../../types";

export interface iRacingContextType {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  data?: iRacingData;
  sendCommand: iRacingSocket["sendCommand"];
}

const DEFAULT_CONTEXT: iRacingContextType = {
  isSocketConnected: false,
  isIRacingConnected: false,
  data: undefined,
  sendCommand: () => {},
};

export const iRacingContext =
  React.createContext<iRacingContextType>(DEFAULT_CONTEXT);
iRacingContext.displayName = "iRacingContext";

export const useIRacingContext = () => React.useContext(iRacingContext);
