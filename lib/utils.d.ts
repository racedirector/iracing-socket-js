import { CarClassIndex, CarClassIdentifier, TrackLocation, CarClassIDProvider, iRacingData } from "./types";
export declare const parseTrackLength: ({ WeekendInfo: { TrackLength: trackLengthString }, }: iRacingData) => number | null;
export declare const parseSessionLength: (data: iRacingData) => number | null;
export declare const identifyCarClasses: (drivers: CarClassIdentifier[], includePaceCar?: boolean) => CarClassIndex;
export declare const isMultiClass: (drivers: CarClassIDProvider[]) => boolean;
export declare const isOnTrack: (location: TrackLocation) => boolean;
interface SessionNameProvider {
    SessionName: "RACE" | string;
}
export declare const isRaceSession: ({ SessionName }: SessionNameProvider) => boolean;
export {};
