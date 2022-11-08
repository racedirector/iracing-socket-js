import { Action, Middleware } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
} from "../core";
import { iRacingSocketCommands } from "../types";
import {
  cameraSetState,
  cameraSwitchNumber,
  cameraSwitchPosition,
  chatCommand,
  chatCommandMacro,
  connect,
  disconnect,
  reloadAllTextures,
} from "./actions";
import {
  setSocketConnected,
  setIRacingConnected,
  updateIRacingData,
} from "./state";

export type CreateIRacingSocketMiddleware = () => Middleware;

export const createIRacingSocketMiddleware = (): Middleware => {
  let socket: iRacingSocket = null;

  return (store) => (next) => (action: Action) => {
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
        const newEntries = Object.entries(socket?.data || {}).filter(([key]) =>
          keys.includes(key),
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
    } else if (cameraSwitchPosition.match(action)) {
      const { position, cameraGroup, cameraNumber } = action.payload;
      socket.sendCommand(iRacingSocketCommands.CameraSwitchPosition, [
        position,
        cameraGroup,
        cameraNumber,
      ]);
    } else if (cameraSwitchNumber.match(action)) {
      const { number, cameraGroup, cameraNumber } = action.payload;
      socket.sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
        number,
        cameraGroup,
        cameraNumber,
      ]);
    } else if (cameraSetState.match(action)) {
      socket.sendCommand(iRacingSocketCommands.CameraSetState, [
        action.payload,
      ]);
    } else if (chatCommand.match(action)) {
      socket.sendCommand(iRacingSocketCommands.ChatCommand, [action.payload]);
    } else if (chatCommandMacro.match(action)) {
      socket.sendCommand(iRacingSocketCommands.ChatCommandMacro, [
        action.payload,
      ]);
    } else if (reloadAllTextures.match(action)) {
      socket.sendCommand(iRacingSocketCommands.ReloadAllTextures, undefined);
    }

    return next(action);
  };
};

export default createIRacingSocketMiddleware;
