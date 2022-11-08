import { Action, Middleware } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
} from "../core";
import { connect, disconnect } from "./actions";
import {
  setSocketConnected,
  setIRacingConnected,
  updateIRacingData,
} from "./state";

export type CreateIRacingSocketMiddleware = () => Middleware;

export const createIRacingSocketMiddleware = <S>(): Middleware<
  Record<string, never>,
  S
> => {
  let socket: iRacingSocket = null;

  return (store) => {
    return (next) => {
      return (action: Action) => {
        if (connect.match(action)) {
          if (socket !== null) {
            socket.close();
          }

          socket = new iRacingSocket(action.payload);
          socket.socketConnectionEmitter
            .on(iRacingSocketConnectionEvents.Connect, () =>
              store.dispatch(setSocketConnected(true)),
            )
            .on(iRacingSocketConnectionEvents.Disconnect, () =>
              store.dispatch(setSocketConnected(false)),
            );

          socket.iRacingConnectionEmitter
            .on(iRacingClientConnectionEvents.Connect, () =>
              store.dispatch(setIRacingConnected(true)),
            )
            .on(iRacingClientConnectionEvents.Disconnect, () =>
              store.dispatch(setIRacingConnected(false)),
            );

          socket.on(iRacingSocketEvents.Update, (keys: string[]) => {
            const newEntries = Object.entries(socket?.data || {}).filter(
              ([key]) => keys.includes(key),
            );

            const newData = Object.fromEntries(newEntries);
            if (!isEmpty(newData)) {
              store.dispatch(updateIRacingData(newData));
            }
          });

          socket.open();
        } else if (disconnect.match(action)) {
          if (socket !== null) {
            socket.close();
          }

          socket = null;
        }

        return next(action);
      };
    };
  };
};

export default createIRacingSocketMiddleware;
