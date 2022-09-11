import * as React from "react";
import { iRacingData } from "../../types";

export interface iRacingContextType {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  data?: iRacingData;
}

const DEFAULT_CONTEXT: iRacingContextType = {
  isSocketConnected: false,
  isIRacingConnected: false,
  data: undefined,
};

export const iRacingContext =
  React.createContext<iRacingContextType>(DEFAULT_CONTEXT);
iRacingContext.displayName = "iRacingContext";

export const useIRacingContext = () => React.useContext(iRacingContext);
