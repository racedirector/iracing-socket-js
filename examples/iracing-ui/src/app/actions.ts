import {
  Flags,
  SessionState,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import {
  ActionCreatorWithOptionalPayload,
  createAction,
} from "@reduxjs/toolkit";
import {
  isPitLaneEntry,
  isPitStallEntry,
  isPitStallExit,
  isPitLaneExit,
  isTrackEntry,
  isOffTrack,
  isTow,
} from "../utils";

const createEventType = (event: string) => `iRacingMiddleware/${event}`;

interface SessionEvent {
  sessionTime: number;
  sessionNumber: number;
}

interface SessionCarEvent extends SessionEvent {
  carIndex: number;
  lapPercentage?: number;
}

export const pitEntry = createAction<SessionCarEvent>(
  createEventType("pitEntry"),
);

export const pitExit = createAction<SessionCarEvent>(
  createEventType("pitExit"),
);

export const pitStallEntry = createAction<SessionCarEvent>(
  createEventType("pitStallEntry"),
);

export const pitStallExit = createAction<SessionCarEvent>(
  createEventType("pitStallExit"),
);

export const trackEntry = createAction<SessionCarEvent>(
  createEventType("trackEntry"),
);

export const offTrack = createAction<SessionCarEvent>(
  createEventType("offTrack"),
);

export const tow = createAction<SessionCarEvent>(createEventType("tow"));

export const actionCreatorForTrackLocationChange = (
  previous: TrackLocation,
  current: TrackLocation,
): ActionCreatorWithOptionalPayload<SessionCarEvent> | undefined => {
  if (isPitLaneEntry(previous, current)) {
    return pitEntry;
  } else if (isPitStallEntry(previous, current)) {
    return pitStallEntry;
  } else if (isPitStallExit(previous, current)) {
    return pitStallExit;
  } else if (isPitLaneExit(previous, current)) {
    return pitExit;
  } else if (isTrackEntry(previous, current)) {
    return trackEntry;
  } else if (isOffTrack(previous, current)) {
    return offTrack;
  } else if (isTow(previous, current)) {
    return tow;
  }
};

interface FlagsChangedPayload extends SessionEvent {
  currentFlags: Flags;
  previousFlags: Flags;
}

export const flagsChanged = createAction<FlagsChangedPayload>(
  createEventType("flagsChanged"),
);

interface PlayerTrackLocationChangedPayload extends SessionEvent {
  currentTrackLocation: TrackLocation;
  previousTrackLocation: TrackLocation;
}

export const playerTrackLocationChanged =
  createAction<PlayerTrackLocationChangedPayload>(
    createEventType("playerTrackLocationChanged"),
  );

interface PlayerIsOnTrackChangedPayload extends SessionEvent {
  currentIsOnTrack: boolean;
  previousIsOnTrack: boolean;
}

export const playerIsOnTrackChanged =
  createAction<PlayerIsOnTrackChangedPayload>(
    createEventType("playerIsOnTrackChanged"),
  );

interface PlayerIsInGarageChangedPayload {
  currentIsInGarage: boolean;
  previousIsInGarage: boolean;
}

export const playerIsInGarageChanged =
  createAction<PlayerIsInGarageChangedPayload>(
    createEventType("playerIsInGarageChanged"),
  );

interface PlayerOnPitRoadChangedPayload extends SessionEvent {
  currentOnPitRoad: boolean;
  previousOnPitRoad: boolean;
}

export const playerOnPitRoadChanged =
  createAction<PlayerOnPitRoadChangedPayload>(
    createEventType("playerOnPitRoadChanged"),
  );

interface SessionStateChangedPayload extends SessionEvent {
  currentSessionState: SessionState;
  previousSessionState: SessionState;
}

export const sessionStateChanged = createAction<SessionStateChangedPayload>(
  createEventType("playerSessionStateChanged"),
);

export const playerLapStarted = createAction(
  createEventType("playerLapStarted"),
);
