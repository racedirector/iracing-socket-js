import { useContext, createContext } from "react";
import { iRacingSocket } from "../../core";
import { iRacingData } from "../../types";

export interface iRacingContextType {
  connecting: boolean;
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  data?: iRacingData;
  sendCommand: iRacingSocket["sendCommand"];
}

const DEFAULT_CONTEXT: iRacingContextType = {
  connecting: false,
  isSocketConnected: false,
  isIRacingConnected: false,
  data: undefined,
  sendCommand: () => {},
};

export const iRacingContext =
  createContext<iRacingContextType>(DEFAULT_CONTEXT);
iRacingContext.displayName = "iRacingContext";

export const useIRacingContext = () => useContext(iRacingContext);
