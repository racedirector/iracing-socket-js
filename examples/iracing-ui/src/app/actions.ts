import {
  Flags,
  SessionState,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { createAction } from "@reduxjs/toolkit";

interface FlagsChangedPayload {
  currentFlags: Flags;
  previousFlags: Flags;
  sessionTime: number;
}

export const flagsChanged = createAction<FlagsChangedPayload>(
  "iRacingMiddleware/flagsChanged",
);

interface PlayerTrackLocationChangedPayload {
  currentTrackLocation: TrackLocation;
  previousTrackLocation: TrackLocation;
  sessionTime: number;
}

export const playerTrackLocationChanged =
  createAction<PlayerTrackLocationChangedPayload>(
    "iRacingMiddleware/playerTrackLocationChanged",
  );

interface PlayerIsOnTrackChangedPayload {
  currentIsOnTrack: boolean;
  previousIsOnTrack: boolean;
  sessionTime: number;
}

export const playerIsOnTrackChanged =
  createAction<PlayerIsOnTrackChangedPayload>(
    "iRacingMiddleware/playerIsOnTrackChanged",
  );

interface PlayerIsInGarageChangedPayload {
  currentIsInGarage: boolean;
  previousIsInGarage: boolean;
}

export const playerIsInGarageChanged =
  createAction<PlayerIsInGarageChangedPayload>(
    "iRacingMiddleware/playerIsInGarageChanged",
  );

interface PlayerOnPitRoadChangedPayload {
  currentOnPitRoad: boolean;
  previousOnPitRoad: boolean;
  sessionTime: number;
}

export const playerOnPitRoadChanged =
  createAction<PlayerOnPitRoadChangedPayload>(
    "iRacingMiddleware/playerOnPitRoadChanged",
  );

interface SessionStateChangedPayload {
  currentSessionState: SessionState;
  previousSessionState: SessionState;
  sessionTime: number;
}

export const sessionStateChanged = createAction<SessionStateChangedPayload>(
  "iRacingMiddleware/playerSessionStateChanged",
);

export const playerLapStarted = createAction(
  "iRacingMiddleware/playerLapStarted",
);
