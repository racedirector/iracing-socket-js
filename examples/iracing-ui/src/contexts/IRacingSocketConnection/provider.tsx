import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  IRacingSocketConnectionContext,
  IRacingSocketConnectionContextType,
} from "./context";

export interface IRacingSocketConnectionProviderProps {}

export const IRacingSocketConnectionProvider: React.FC<
  PropsWithChildren<IRacingSocketConnectionProviderProps>
> = ({ children = null }) => {
  const [state, setState] = useState({
    host: "192.168.4.52",
    port: "8182",
  });

  const setPortCallback = useCallback(
    (port) => setState((previous) => ({ ...previous, port })),
    [setState],
  );

  const setHostCallback = useCallback(
    (host) => setState((previous) => ({ ...previous, host })),
    [setState],
  );

  const providerState: IRacingSocketConnectionContextType = useMemo(
    () => ({
      ...state,
      setPort: setPortCallback,
      setHost: setHostCallback,
    }),
    [state, setPortCallback, setHostCallback],
  );

  return (
    <IRacingSocketConnectionContext.Provider value={providerState}>
      {children}
    </IRacingSocketConnectionContext.Provider>
  );
};

export default IRacingSocketConnectionProvider;
