import { useContext, createContext } from "react";

export interface IRacingSocketConnectionContextType {
  host: string;
  port: string;
  setHost: (host: string) => void;
  setPort: (port: string) => void;
}

export const IRacingSocketConnectionContext =
  createContext<IRacingSocketConnectionContextType>(null);
IRacingSocketConnectionContext.displayName = "IRacingSocketConnectionContext";

export const useIRacingSocketConnectionContext = () =>
  useContext(IRacingSocketConnectionContext);
