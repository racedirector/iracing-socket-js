import { TrackLocation, iRacingData, Flags } from "../../types";

export const flagsHasFlag = (flags: Flags, hasFlags: Flags): boolean =>
  (flags & hasFlags) === hasFlags;

export const flagsHasFlags = (flags: Flags, ...hasFlags: Flags[]): boolean[] =>
  hasFlags.map((flag) => flagsHasFlag(flags, flag));

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

/**
 *
 * @param location a track location
 * @returns whether or not the track location is on track.
 */
export const isOnTrack = (location: TrackLocation) =>
  location > TrackLocation.OffTrack;
