import { Driver, Flags, iRacingData, PaceFlags, Session } from "../types";
import { canUseSymbol } from "./globals";
export * from "./position";

export { canUseSymbol };

export const formatTime = (
  time: number,
  precision = 3,
  showMinutes = false,
) => {
  const sign = time >= 0;
  let normalizedTime = Math.abs(time);

  if (precision > 0) {
    const precisePow = [10, 100, 1000][precision - 1];
    normalizedTime = Math.round(normalizedTime * precisePow) / precisePow;
  } else {
    normalizedTime = Math.round(normalizedTime);
  }

  const hours = (normalizedTime / 3600) | 0;
  const minutes = ((normalizedTime / 60) | 0) % 60;
  const seconds = normalizedTime % 60;

  let response = "";
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString =
    seconds < 10
      ? `0${seconds.toFixed(precision)}`
      : seconds.toFixed(precision);

  if (hours) {
    response += `${hours}:`;
  }

  if (minutes || showMinutes) {
    response += `${minutesString}:${secondsString}`;
  } else {
    response += seconds.toFixed(precision);
  }

  if (!sign) {
    response = `-${response}`;
  }

  return response;
};

export const formatTimeForSession = (time: number) => {
  const hours = (time / 3600) | 0;
  const minutes = ((time / 60) | 0) % 60;
  let result = "";
  if (hours) {
    result += `${hours}h`;
  }

  if (minutes) {
    if (hours && minutes < 10) {
      result += `0${minutes}m`;
    } else {
      result += `${minutes}m`;
    }
  }

  return result;
};

export interface FastestLapTimeProvider {
  FastestTime: number;
}

export const getFastestLap = <T extends FastestLapTimeProvider>(
  results: T[],
): number => {
  return results.reduce((fastestLapTime, { FastestTime: fastestTime }) => {
    if (fastestLapTime < 0 || fastestTime < fastestLapTime) {
      return fastestTime;
    }

    return fastestLapTime;
  }, -1);
};

export const sessionIsRaceSession = (session: Session) =>
  session?.SessionName === "RACE";

export const getSessionTime = ({
  SessionTime: sessionTime = "unknown",
}: Session) => {
  if (sessionTime === "unlimited") {
    return sessionTime;
  }

  const totalTime = parseInt(sessionTime);
  return Number.isNaN(totalTime) ? null : totalTime;
};

export const getSessionLaps = ({
  SessionLaps: sessionLaps = "unknown",
}: Session) => {
  const lapCount = parseInt(sessionLaps);
  return Number.isNaN(lapCount) ? null : lapCount;
};

export const getSessionResultsPositions = (session: Session) => {
  return session?.ResultsPositions || [];
};

const MAGIC_NUMBER = 1600;
export const getStrengthOfDrivers = (drivers: Driver[]) => {
  const total = drivers.reduce(
    (totalIRating, { IRating }) =>
      totalIRating + Math.pow(2, -IRating / MAGIC_NUMBER),
    0,
  );

  const strength =
    (MAGIC_NUMBER / Math.log(2)) * Math.log(drivers.length / total);

  return strength / 1000;
};

const bitwiseFlagHasFlag = (bitwise: number, hasFlag: number): boolean =>
  (bitwise & hasFlag) === hasFlag;

export const flagsHasFlag = (flags: Flags, hasFlags: Flags) =>
  bitwiseFlagHasFlag(flags, hasFlags);

export const flagsHasFlags = (flags: Flags, ...hasFlags: Flags[]): boolean[] =>
  hasFlags.map((flag) => flagsHasFlag(flags, flag));

export const flagsHasSomeFlags = (
  flags: Flags,
  ...hasFlags: Flags[]
): boolean =>
  flagsHasFlags(flags, ...hasFlags).reduce(
    (someFlags, hasFlag) => someFlags || hasFlag,
    false,
  );

export const flagsHasAllFlags = (flags: Flags, ...hasFlags: Flags[]): boolean =>
  hasFlags.every((flag) => flagsHasFlag(flags, flag));

export const paceFlagsHasPaceFlag = (
  flags: PaceFlags,
  hasPaceFlags: PaceFlags,
) => bitwiseFlagHasFlag(flags, hasPaceFlags);

export const paceFlagsHasPaceFlags = (
  flags: PaceFlags,
  ...hasPaceFlags: PaceFlags[]
) => hasPaceFlags.map((flag) => paceFlagsHasPaceFlag(flags, flag));

export const parseNumberFromString = (sourceValue: string, unit: string) => {
  const matches =
    new RegExp(`^.*(?=\\s${unit})`).exec(sourceValue) || Array<string>();
  if (matches.length > 0) {
    return parseFloat(matches[0]);
  }

  return null;
};

export const parseTrackLength = ({
  WeekendInfo: { TrackLength: trackLengthString = null } = {},
}: iRacingData): number | null => {
  if (typeof trackLengthString === "string") {
    return parseNumberFromString(trackLengthString, "km") * 1000;
  }

  return null;
};
