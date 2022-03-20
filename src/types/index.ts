// See `docs/` for more info

export const PACE_CAR_CLASS_ID = 11;

interface LiveData {
  // Laps completed in race (int)
  RaceLaps: number;
  // Session number (int)
  SessionNum: number;
  // Bit field of flags
  SessionFlags: Flags;
  // Seconds since session start
  SessionTime: number;
  // Time of day in seconds
  SessionTimeOfDay: number;
  // Bitfield of pit service checkboxes
  PitSvFlags: PitServiceFlags;
  // Pit service fuel add amount
  PitSvFuel: number;
  // ???: Not officially documented :)
  PlayerCarPitSvStatus: PitServiceFlags;
  // Pit stop active boolean
  PitStopActive: boolean;
}

interface LiveSensorData {
  // CF ride height (float, m)
  CFrideHeight: number;
  // CF shock deflection (float, m)
  CFshockDefl: number;
  // CF shock velocity (float, m/s)
  CFshockVel: number;
  // CFSR ride height (float, m)
  CFSRrideHeight: number;
  // CR ride height (float, m)
  CRrideHeight: number;
  // CR shock deflection (float, m)
  CRshockDefl: number;
  // CR shock velocity (float, m/s)
  CRshockVel: number;
}

interface LiveCarData {
  // Cars class position in race by car index (int)
  CarIdxClassPosition: number[];
  // Estimated time to reach current location on track (float, seconds)
  CarIdxEstTime: number[];
  // Race time behind leader or fastest lap time otherwise (float, seconds)
  CarIdxF2Time: number[];
  // -1=reverse 0=neutral 1..n=current gear by car index (int)
  CarIdxGear: number[];
  // Lap count by car index (int)
  CarIdxLap: number[];
  // Percentage distance around lap by car index (float, percentage)
  CarIdxLapDistPct: number[];
  // On pit road between the cones by car index (int, boolean)
  CarIdxOnPitRoad: number[];
  // Cars position in race by car index (int)
  CarIdxPosition: number[];
  // Engine rpm by car index (float, revs/min)
  CarIdxRPM: number[];
  // Steering wheel angle by car index (float, rads)
  CarIdxSteer: number[];
  // Track surface type by car index (int, `TrackLocation`)
  CarIdxTrackSurface: TrackLocation[];
  // Track surface material by car index (int, TrackSurface)
  CarIdxTrackSurfaceMaterial: TrackSurface[];
  // Best lap time by car index (float, seconds)
  CarIdxBestLapTime: number[];
  PlayerTrackSurface: TrackSurface;
}

export interface Driver {
  CarIdx: number;
  UserID: number;
  UserName: string;
  AbbrevName: string;
  TeamID: number;
  TeamName: string;
  CarNumber: string;
  CarNumberRaw: number;
  CurDriverIncidentCount: number;
  CarClassID: number;
  CarID: number;
  CarIsPaceCar: number;
  CarIsAI: number;
  CarScreenName: string;
  CarScreenNameShort: string;
  CarClassShortName: string | null;
  CarClassRelSpeed: number;
  CarClassLicenseLevel: number;
  CarClassMaxFuelPct: string;
  CarClassWeightPenalty: string;
  CarClassPowerAdjust: string;
  CarClassDryTireSetLimit: string;
  CarClassColor: number;
  CarClassEstLapTime: number;
  IRating: number;
  LicLevel: number;
  LicSubLevel: number;
  LicString: string;
  LicColor: string;
  IsSpectator: number;
  CarDesignStr: string;
  HelmetDesignStr: string;
  SuitDesignStr: string;
  CarNumberDesignStr: string;
  TeamIncidentCount: number;
}

interface DriverInfoData {
  DriverCarIdx: number;
  Drivers: Driver[];
}

interface SessionStringData {
  WeekendInfo: Record<string, any>;
  DriverInfo: Partial<DriverInfoData>;
  SessionInfo: Record<string, any>;
  QualifyResultsInfo: Record<string, any>;
  CameraInfo: Record<string, any>;
  RadioInfo: Record<string, any>;
  SplitTimeInfo: Record<string, any>;
}

// !!!: It's all partial cause it's not guaranteed that a socket will be asking for all
// of it, nor is it guaranteed to come back. You get what you get ¯\_(ツ)_/¯
export interface iRacingData
  extends Partial<LiveData>,
    Partial<LiveSensorData>,
    Partial<LiveCarData>,
    Partial<SessionStringData> {
  // !!!: Don't let this come back unless you're really annoyed cause
  // people should just come back here and file a PR and add the types.
  // See `docs/`
  // [key: string]: any;
}

export type iRacingDataKey = keyof iRacingData;

export type DriverIndex = Record<number, Driver>;

export enum Flags {
  // global flags
  Checkered = 0x0001,
  White = 0x0002,
  Green = 0x0004,
  Yellow = 0x0008,
  Red = 0x0010,
  Blue = 0x0020,
  Debris = 0x0040,
  Crossed = 0x0080,
  YellowWaving = 0x0100,
  OneLapToGreen = 0x0200,
  GreenHeld = 0x0400,
  TenToGo = 0x0800,
  FiveToGo = 0x1000,
  RandomWaving = 0x2000,
  Caution = 0x4000,
  CautionWaving = 0x8000,

  // drivers black flags
  Black = 0x010000,
  Disqualify = 0x020000,
  Servicible = 0x040000, // car is allowed service (not a flag)
  Furled = 0x080000,
  Repair = 0x100000,

  // start lights
  StartHidden = 0x10000000,
  StartReady = 0x20000000,
  StartSet = 0x40000000,
  StartGo = 0x80000000,
}

export enum TrackLocation {
  NotInWorld = -1,
  OffTrack = 0,
  InPitStall = 1,
  ApproachingPits = 2,
  OnTrack = 3,
}

export enum TrackSurface {
  NotInWorld = -1,
  Undefined = 0,
  Asphalt_1 = 1,
  Asphalt_2 = 2,
  Asphalt_3 = 3,
  Asphalt_4 = 4,
  Concrete_1 = 5,
  Concrete_2 = 6,
  RacingDirt_1 = 7,
  RacingDirt_2 = 8,
  Paint_1 = 9,
  Paint_2 = 10,
  Rumble_1 = 11,
  Rumble_2 = 12,
  Rumble_3 = 13,
  Rumble_4 = 14,
  Grass_1 = 15,
  Grass_2 = 16,
  Grass_3 = 17,
  Grass_4 = 18,
  Dirt_1 = 19,
  Dirt_2 = 20,
  Dirt_3 = 21,
  Dirt_4 = 22,
  Sand = 23,
  Gravel_1 = 24,
  Gravel_2 = 25,
  Grasscrete = 26,
  Astroturf = 27,
}

export enum SessionState {
  Invalid = 0,
  GetInCar = 1,
  Warmup = 2,
  ParadeLaps = 3,
  Racing = 4,
  Checkered = 5,
  CoolDown = 6,
}

export enum CameraState {
  IsSessionScreen = 0x0001, // the camera tool can only be activated if viewing the session screen (out of car)
  IsScenicActive = 0x0002, // the scenic camera is active (no focus car)

  // these can be changed with a broadcast message
  CamToolActive = 0x0004,
  UiHidden = 0x0008,
  UseAutoShotSelection = 0x0010,
  UseTemporaryEdits = 0x0020,
  UseKeyAcceleration = 0x0040,
  UseKey10xAcceleration = 0x0080,
  UseMouseAimMode = 0x0100,
}

export enum PitServiceFlags {
  LFChange = 0x01,
  RFChange = 0x02,
  LRChange = 0x04,
  RRChange = 0x08,
  Fuel = 0x10,
  WindshieldTearoff = 0x20,
  FastRepair = 0x40,
}

export enum PitServiceStatus {
  // status
  None = 0,
  InProgress = 1,
  Complete = 2,
  // errors
  TooFarLeft = 100,
  TooFarRight = 101,
  TooFarForward = 102,
  TooFarBack = 103,
  BadAngle = 104,
  CantFixThat = 105,
}

export enum PaceMode {
  SingleFileStart = 0,
  DoubleFileStart = 1,
  SingleFileRestart = 2,
  DoubleFileRestart = 3,
  NotPacing = 4,
}

export enum PaceFlags {
  EndOfLine = 0x01,
  FreePass = 0x02,
  WavedAround = 0x04,
}

export enum CarLeftRight {
  Clear = 1, // no cars around us.
  CarLeft = 2, // there is a car to our left.
  CarRight = 3, // there is a car to our right.
  CarLeftRight = 4, // there are cars on each side.
  TwoCarsLeft = 5, // there are two cars to our left.
  TwoCarsRight = 6, // there are two cars to our right.
}

export enum FFBCommandMode { // You can call this any time
  FFBCommandMaxForce = 0, // Set the maximum force when mapping steering torque force to direct input units (float in Nm)
}

export enum VideoCaptureMode {
  TriggerScreenShot = 0, // save a screenshot to disk
  StartVideoCapture = 1, // start capturing video
  EndVideoCapture = 2, // stop capturing video
  ToggleVideoCapture = 3, // toggle video capture on/off
  ShowVideoTimer = 4, // show video timer in upper left corner of display
  HideVideoTimer = 5, // hide video timer
}
