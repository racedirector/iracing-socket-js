import { useContext, createContext } from "react";

export interface IRacingSocketConnectionContextType {
  server: string;
  setServer: (server: string) => void;
}

export const IRacingSocketConnectionContext =
  createContext<IRacingSocketConnectionContextType>(null);
IRacingSocketConnectionContext.displayName = "IRacingSocketConnectionContext";

export const useIRacingSocketConnectionContext = () =>
  useContext(IRacingSocketConnectionContext);
