import { createContext } from "react";
import moment from "moment";

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
