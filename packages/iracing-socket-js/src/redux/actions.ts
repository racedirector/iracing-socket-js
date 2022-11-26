import { createAction } from "@reduxjs/toolkit";
import { iRacingSocketOptions } from "../core";
import {
  CameraState,
  ChatCommand,
  FFBCommandMode,
  PitCommandMode,
  ReplayPlayPosition,
  ReplaySearchCommand,
  TelemetryCommand,
  VideoCaptureMode,
} from "../types";

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

export const reloadAllTextures = createAction<undefined>(
  "iRacingSocket/reloadAllTextures",
);

export const reloadTexture = createAction<number>(
  "iRacingSocket/reloadTexture",
);

export const telemetryCommand = createAction<TelemetryCommand>(
  "iRacingSocket/telemetryCommand",
);

interface FFBCommandPayload {
  command: FFBCommandMode;
  maxForce: number;
}

export const ffbCommand = createAction<FFBCommandPayload>(
  "iRacingSocket/ffbCommand",
);

export const videoCapture = createAction<VideoCaptureMode>(
  "iRacingSocket/videoCapture",
);

interface ReplaySetPlaySpeedPayload {
  speed: number;
  slowMotion: boolean;
}

export const replaySetPlaySpeed = createAction<ReplaySetPlaySpeedPayload>(
  "iRacingSocket/replaySetPlaySpeed",
);

interface ReplaySetPlayPositionPayload {
  playPosition: ReplayPlayPosition;
  frameNumber: number;
}

export const replaySetPlayPosition = createAction<ReplaySetPlayPositionPayload>(
  "iRacingSocket/replaySetPlayPosition",
);

export const replaySetState = createAction<undefined>(
  "iRacingSocket/replaySetState",
);

export const replaySearch = createAction<ReplaySearchCommand>(
  "iRacingSocket/replaySearch",
);

interface ReplaySearchSessionTimePayload {
  sessionNumber: number;
  sessionTime: number;
}

export const replaySearchSessionTime =
  createAction<ReplaySearchSessionTimePayload>(
    "iRacingSocket/replaySearchSessionTime",
  );
