export interface iRacingData {
  [key: string]: any;
}

export type Driver = {
  CarIdx: number;
  UserID: number;
  CurDriverIncidentCount: number;
  CarClassID: number;
  CarIsPaceCar: number;
  CarIsAI: number;
  CarClassRelSpeed: number;
};

export type DriverIndex = Record<number, Driver>;

export enum TrackLocation {
  NotInWorld = -1,
  OffTrack = 0,
  InPitStall = 1,
  ApproachingPits = 2,
  OnTrack = 3,
}

export interface CarClass {
  id: string;
  className: string;
  relativeSpeed: string;
  carName: string;
  carNameShort: string;
  color?: string;
}

export type CarClassIndex = Record<string, CarClass>;

export interface CarClassIdentifier {
  CarClassID: number | null;
  CarScreenName: string | null;
  CarScreenNameShort: string | null;
  CarClassShortName: string | null;
  CarClassRelSpeed: number | null;
  CarClassLicenseLevel: number | null;
  CarClassMaxFuelPct: string | null;
  CarClassWeightPenalty: string | null;
  CarClassPowerAdjust: string | null;
  CarClassDryTireSetLimit: string | null;
  CarClassColor: number | null;
  CarClassEstLapTime: number | null;
}

export type CarClassIDProvider = Pick<CarClassIdentifier, "CarClassID">;
