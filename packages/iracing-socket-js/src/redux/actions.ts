import { createAction } from "@reduxjs/toolkit";
import { iRacingSocketOptions } from "../core";
import { CameraState, ChatCommand, PitCommandMode } from "../types";

export const connect = createAction<iRacingSocketOptions>(
  "iRacingSocket/connect",
);

export const disconnect = createAction("iRacingSocket/disconnect");

interface CameraSwitchPositionPayload {
  position: number;
  cameraGroup: number;
  cameraNumber: number;
}

export const cameraSwitchPosition = createAction<CameraSwitchPositionPayload>(
  "iRacingSocket/cameraSwitchPosition",
);

interface CameraSwitchNumberPayload {
  number: string;
  cameraGroup: number;
  cameraNumber: number;
}

export const cameraSwitchNumber = createAction<CameraSwitchNumberPayload>(
  "iRacingSocket/CameraSwitchNumber",
);

export const cameraSetState = createAction<CameraState>(
  "iRacingSocket/cameraSetState",
);

interface PitCommandPayload {
  command: PitCommandMode;
  fuel: number;
}

export const pitCommand = createAction<PitCommandPayload>(
  "iRacingSocket/pitCommand",
);

export const chatCommand = createAction<ChatCommand>(
  "iRacingSocket/chatCommand",
);

export const chatCommandMacro = createAction<number>(
  "iRacingSocket/chatCommandMacro",
);

export const reloadAllTextures = createAction(
  "iRacingSocket/reloadAllTextures",
);
