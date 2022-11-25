import {
  Flags,
  SessionState,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { createAction } from "@reduxjs/toolkit";

interface SessionEvent {
  sessionTime: number;
  sessionNumber: number;
}

interface FlagsChangedPayload extends SessionEvent {
  currentFlags: Flags;
  previousFlags: Flags;
}

export const flagsChanged = createAction<FlagsChangedPayload>(
  "iRacingMiddleware/flagsChanged",
);

interface PlayerTrackLocationChangedPayload extends SessionEvent {
  currentTrackLocation: TrackLocation;
  previousTrackLocation: TrackLocation;
}

export const playerTrackLocationChanged =
  createAction<PlayerTrackLocationChangedPayload>(
    "iRacingMiddleware/playerTrackLocationChanged",
  );

interface PlayerIsOnTrackChangedPayload extends SessionEvent {
  currentIsOnTrack: boolean;
  previousIsOnTrack: boolean;
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

interface PlayerOnPitRoadChangedPayload extends SessionEvent {
  currentOnPitRoad: boolean;
  previousOnPitRoad: boolean;
}

export const playerOnPitRoadChanged =
  createAction<PlayerOnPitRoadChangedPayload>(
    "iRacingMiddleware/playerOnPitRoadChanged",
  );

interface SessionStateChangedPayload extends SessionEvent {
  currentSessionState: SessionState;
  previousSessionState: SessionState;
}

export const sessionStateChanged = createAction<SessionStateChangedPayload>(
  "iRacingMiddleware/playerSessionStateChanged",
);

export const playerLapStarted = createAction(
  "iRacingMiddleware/playerLapStarted",
);
