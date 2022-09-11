import { useEffect, useState, useMemo } from "react";
import * as React from "react";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
} from "../../core";
import { iRacingContext, iRacingContextType } from "./iRacingContext";
import { iRacingData } from "../../types";

export interface iRacingProviderProps {
  socket: iRacingSocket;
  children?: React.ReactNode;
}

export const IRacingProvider: React.FC<iRacingProviderProps> = ({
  socket,
  children,
}) => {
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [isIRacingConnected, setIRacingConnected] = useState(false);
  const [data, setData] = useState<iRacingData>(null);

  useEffect(() => {
    socket.socketConnectionEmitter
      .on(iRacingSocketConnectionEvents.Connect, () => setSocketConnected(true))
      .on(iRacingSocketConnectionEvents.Disconnect, () =>
        setSocketConnected(false),
      );

    socket.iRacingConnectionEmitter
      .on(iRacingClientConnectionEvents.Connect, () =>
        setIRacingConnected(true),
      )
      .on(iRacingClientConnectionEvents.Disconnect, () =>
        setIRacingConnected(false),
      );

    socket.on(iRacingSocketEvents.Update, (data) => {
      setData((previousData) => ({ ...previousData, ...data }));
    });

    return () => {
      socket.close();
      socket.removeAllListeners();
    };
  }, [socket]);

  const socketState = useMemo<iRacingContextType>(
    () => ({ data, isIRacingConnected, isSocketConnected }),
    [data, isIRacingConnected, isSocketConnected],
  );

  return (
    <iRacingContext.Provider value={socketState}>
      {children}
    </iRacingContext.Provider>
  );
};

export default IRacingProvider;
