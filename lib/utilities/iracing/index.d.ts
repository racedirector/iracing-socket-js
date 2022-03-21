import { TrackLocation, iRacingData, Flags } from "../../types";
export declare const flagsHasFlag: (flags: Flags, hasFlags: Flags) => boolean;
export declare const flagsHasFlags: (flags: Flags, ...hasFlags: Flags[]) => boolean[];
export declare const flagsHasSomeFlags: (flags: Flags, ...hasFlags: Flags[]) => boolean;
export declare const flagsHasAllFlags: (flags: Flags, ...hasFlags: Flags[]) => boolean;
export declare const parseNumberFromString: (sourceValue: string, unit: string) => number;
export declare const parseTrackLength: ({ WeekendInfo: { TrackLength: trackLengthString }, }: iRacingData) => number | null;
export declare const isOnTrack: (location: TrackLocation) => boolean;
//# sourceMappingURL=index.d.ts.map