import { Middleware } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
  iRacingSocketOptions,
} from "../core";
import { connect, disconnect } from "./actions";
import {
  setSocketConnected,
  setIRacingConnected,
  updateIRacingData,
} from "./state";

export interface IRacingSocketMiddlewareOptions extends iRacingSocketOptions {}

export type CreateIRacingSocketMiddleware = (
  options?: IRacingSocketMiddlewareOptions,
) => Middleware;

export const createIRacingSocketMiddleware = ({
  server = "localhost:8182",
  requestParameters = [],
  requestParametersOnce = [],
  fps = 10,
  readIBT = false,
  reconnectTimeoutInterval = 5,
  autoconnect = true,
} = {}): Middleware => {
  let socket: iRacingSocket = null;

  // TODO: There's gotta be some way to make this like, not need all these params up front
  return (store) => {
    return (next) => {
      const connectActionName = connect.toString();
      const disconnectActionName = disconnect.toString();

      return (action) => {
        switch (action.type) {
          case connectActionName: {
            if (socket !== null) {
              socket.close();
            }

            socket = new iRacingSocket({
              server,
              requestParameters,
              requestParametersOnce,
              fps,
              readIBT,
              reconnectTimeoutInterval,
              autoconnect,
            });

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

            break;
          }
          case disconnectActionName: {
            if (socket !== null) {
              socket.close();
            }

            socket = null;
            break;
          }
          default:
            return next(action);
        }
      };
    };
  };
};

export default createIRacingSocketMiddleware;
