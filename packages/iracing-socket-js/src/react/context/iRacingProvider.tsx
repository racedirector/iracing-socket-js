import { useEffect, useState } from "react";
import * as React from "react";
import { invariant } from "../../utilities/globals";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
} from "../../core";
import { iRacingContext } from "./iRacingContext";

export interface iRacingProviderProps {
  socket: iRacingSocket;
}

export const iRacingProvider: React.FC<iRacingProviderProps> = ({
  socket,
  children,
}) => {
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [isIRacingConnected, setIRacingConnected] = useState(false);

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

    return () => {
      socket.close();
      socket.removeAllListeners();
    };
  }, [socket]);

  return (
    <iRacingContext.Consumer>
      {(context: any = {}) => {
        if (socket && context.socket !== socket) {
          // eslint-disable-next-line no-param-reassign
          context = { ...context, socket };
        }

        invariant(
          context.socket,
          "iRacingProvider was not passed a iRacingSocket instance. Make " +
            'sure you pass in your socket via the "socket" prop.',
        );

        return (
          <iRacingContext.Provider
            value={{
              ...context,
              isSocketConnected,
              isIRacingConnected,
            }}
          >
            {children}
          </iRacingContext.Provider>
        );
      }}
    </iRacingContext.Consumer>
  );
};

export default iRacingProvider;
