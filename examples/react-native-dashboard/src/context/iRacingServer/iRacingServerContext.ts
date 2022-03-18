import {createContext, useContext} from 'react';

export interface iRacingServerContextType {
  host: string | null;
  setHost: (host: string | null) => void;
}

const DEFAULT_CONTEXT: iRacingServerContextType = {
  host: null,
  setHost: () => {},
};

export const iRacingServerContext =
  createContext<iRacingServerContextType>(DEFAULT_CONTEXT);
iRacingServerContext.displayName = 'iRacingServerContext';

export const useIRacingServerContext = () => useContext(iRacingServerContext);
