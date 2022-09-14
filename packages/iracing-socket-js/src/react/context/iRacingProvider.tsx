import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import * as React from "react";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
  iRacingSocketOptions,
} from "../../core";
import { iRacingContext, iRacingContextType } from "./iRacingContext";
import { iRacingData } from "../../types";

export interface iRacingProviderProps extends iRacingSocketOptions {
  children?: React.ReactNode;
}

export const IRacingProvider: React.FC<iRacingProviderProps> = ({
  children,
  ...socketProps
}) => {
  const socketRef = useRef<iRacingSocket>(null);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [isIRacingConnected, setIRacingConnected] = useState(false);
  const [data, setData] = useState<iRacingData>(undefined);

  useEffect(() => {
    const socket = new iRacingSocket(socketProps);
    socketRef.current = socket;

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

    socket.on(iRacingSocketEvents.Update, () => {
      setData((previousData) => ({ ...previousData, ...socket.data }));
    });

    return () => {
      socket.close();
      socket.removeAllListeners();
    };
  }, []);

  const sendCommandCallback = useCallback<iRacingSocket["sendCommand"]>(
    (...params) => {
      socketRef.current.sendCommand(...params);
    },
    [socketRef],
  );

  const socketState = useMemo<iRacingContextType>(
    () => ({
      data,
      isIRacingConnected,
      isSocketConnected,
      sendCommand: sendCommandCallback,
    }),
    [data, isIRacingConnected, isSocketConnected, sendCommandCallback],
  );

  return (
    <iRacingContext.Provider value={socketState}>
      {children}
    </iRacingContext.Provider>
  );
};

export default IRacingProvider;
