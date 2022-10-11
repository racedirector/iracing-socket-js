import React, { PropsWithChildren } from "react";
import { IRacingSocketConnectionContext } from "./context";

export interface IRacingSocketConnectionProviderProps {}

export const IRacingSocketConnectionProvider: React.FC<
  PropsWithChildren<IRacingSocketConnectionProviderProps>
> = ({ children = null }) => {
  return (
    <IRacingSocketConnectionContext.Provider
      value={{
        host: "192.168.4.52",
        port: "8182",
      }}
    >
      {children}
    </IRacingSocketConnectionContext.Provider>
  );
};

export default IRacingSocketConnectionProvider;
