import { createContext } from "react";
import moment from "moment";
import { TrackLocation } from "@racedirector/iracing-socket-js";

export const metersPerSecondToKilometersPerHour = (mps: number) => mps * 3.6;

export const getContextKey = (key: string) => {
  return typeof Symbol === "function" && typeof Symbol.for === "function"
    ? Symbol.for(key)
    : key;
};

export function getContext<T>(
  key: string | symbol,
  initialContext?: T,
): React.Context<T> {
  let context = (createContext as any)[key] as React.Context<T>;
  if (!context) {
    Object.defineProperty(createContext, key, {
      value: (context = createContext<T>(initialContext)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }

  return context;
}

export const normalizeLapTime = (time: number) => {
  return normalizeLapDuration(moment.duration(time, "seconds"));
};

export const normalizeLapDuration = (duration: moment.Duration) => {
  return formatLapTime(
    duration.minutes(),
    duration.seconds(),
    duration.milliseconds(),
  );
};

export const formatLapTime = (
  minutes: number,
  seconds: number,
  milliseconds: number,
) => {
  const normalizedMs = Math.round(milliseconds);
  let normalizedMilliseconds = normalizedMs.toString();
  if (normalizedMs < 10) {
    normalizedMilliseconds = `00${normalizedMs}`;
  } else if (milliseconds < 100) {
    normalizedMilliseconds = `0${normalizedMs}`;
  }

  return `${minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }.${normalizedMilliseconds}`;
};

export interface SessionTimeEvent {
  sessionTime: number;
}

export const sortSessionEvents = <T extends SessionTimeEvent>(
  eventA: T,
  eventB: T,
) => {
  if (eventA.sessionTime < eventB.sessionTime) {
    return -1;
  } else if (eventA.sessionTime > eventB.sessionTime) {
    return 1;
  }

  return 0;
};

type TrackLocationTransitionPredicate = (
  previous: TrackLocation,
  current: TrackLocation,
) => boolean;

export const isPitLaneEntry: TrackLocationTransitionPredicate = (
  previous,
  current,
) =>
  previous === TrackLocation.OnTrack &&
  current === TrackLocation.ApproachingPits;

export const isPitStallEntry: TrackLocationTransitionPredicate = (
  previous,
  current,
) =>
  previous === TrackLocation.ApproachingPits &&
  current === TrackLocation.InPitStall;

export const isPitStallExit: TrackLocationTransitionPredicate = (
  previous,
  current,
) =>
  previous === TrackLocation.InPitStall &&
  current === TrackLocation.ApproachingPits;

export const isPitLaneExit: TrackLocationTransitionPredicate = (
  previous,
  current,
) =>
  previous === TrackLocation.ApproachingPits &&
  current === TrackLocation.OnTrack;

const isTransitionTo: (to: TrackLocation) => TrackLocationTransitionPredicate =
  (to) => (previous, current) =>
    previous !== to && current === to;

export const isOffTrack: TrackLocationTransitionPredicate = isTransitionTo(
  TrackLocation.OffTrack,
);

export const isTrackEntry: TrackLocationTransitionPredicate = isTransitionTo(
  TrackLocation.OnTrack,
);

export const hasLeftWorld: TrackLocationTransitionPredicate = isTransitionTo(
  TrackLocation.NotInWorld,
);

export const isTow: TrackLocationTransitionPredicate = isTransitionTo(
  TrackLocation.InPitStall,
);
