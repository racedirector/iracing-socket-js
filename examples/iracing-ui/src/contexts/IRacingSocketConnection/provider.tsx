import React, { PropsWithChildren, useMemo, useState } from "react";
import {
  IRacingSocketConnectionContext,
  IRacingSocketConnectionContextType,
} from "./context";

export interface IRacingSocketConnectionProviderProps {}

export const IRacingSocketConnectionProvider: React.FC<
  PropsWithChildren<IRacingSocketConnectionProviderProps>
> = ({ children = null }) => {
  const [server, setServer] = useState("192.168.4.52:8182");

  const context: IRacingSocketConnectionContextType = useMemo(
    () => ({
      server,
      setServer,
    }),
    [server, setServer],
  );

  return (
    <IRacingSocketConnectionContext.Provider value={context}>
      {children}
    </IRacingSocketConnectionContext.Provider>
  );
};

export default IRacingSocketConnectionProvider;
