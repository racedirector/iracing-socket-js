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
  ffbCommand,
  pitCommand,
  reloadAllTextures,
  reloadTexture,
  replaySearch,
  replaySearchSessionTime,
  replaySetPlayPosition,
  replaySetPlaySpeed,
  replaySetState,
  telemetryCommand,
  videoCapture,
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
      if (socket) {
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
      if (socket) {
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
    } else if (reloadTexture.match(action)) {
      socket.sendCommand(iRacingSocketCommands.ReloadTexture, [action.payload]);
    } else if (telemetryCommand.match(action)) {
      socket.sendCommand(iRacingSocketCommands.TelemetryCommand, [
        action.payload,
      ]);
    } else if (ffbCommand.match(action)) {
      const { command, maxForce } = action.payload;
      socket.sendCommand(iRacingSocketCommands.FFBCommand, [command, maxForce]);
    } else if (videoCapture.match(action)) {
      socket.sendCommand(iRacingSocketCommands.VideoCapture, [action.payload]);
    } else if (replaySetPlaySpeed.match(action)) {
      const { speed, slowMotion } = action.payload;
      socket.sendCommand(iRacingSocketCommands.ReplaySetPlaySpeed, [
        speed,
        slowMotion,
      ]);
    } else if (replaySetPlayPosition.match(action)) {
      const { playPosition, frameNumber } = action.payload;
      socket.sendCommand(iRacingSocketCommands.ReplaySetPlayPosition, [
        playPosition,
        frameNumber,
      ]);
    } else if (replaySetState.match(action)) {
      socket.sendCommand(iRacingSocketCommands.ReplaySetState, [0]);
    } else if (replaySearchSessionTime.match(action)) {
      const { sessionNumber, sessionTime } = action.payload;
      socket.sendCommand(iRacingSocketCommands.ReplaySearchSessionTime, [
        sessionNumber,
        Math.floor(sessionTime),
      ]);
    } else if (replaySearch.match(action)) {
      socket.sendCommand(iRacingSocketCommands.ReplaySearch, [action.payload]);
    } else if (pitCommand.match(action)) {
      const { command, fuel } = action.payload;
      socket.sendCommand(iRacingSocketCommands.PitCommand, [command, fuel]);
    }

    return next(action);
  };
};

export default createIRacingSocketMiddleware;
