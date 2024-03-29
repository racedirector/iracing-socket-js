// See `docs/` for more info

export const PACE_CAR_CLASS_ID = 11;

export type RaceTime = number | "unlimited";

interface LiveData {
  CpuUsageFG: number;
  CpuUsageBG: number;
  GpuUsage: number;
  ChanAvgLatency: number;
  ChanClockSkew: number;
  ChanLatency: number;
  MemSoftPageFaultSec: number;
  MemPageFaultSec: number;
  FrameRate: number;
  EnterExitReset: number;

  OkToReloadTextures: boolean;

  Lap: number;
  LoadNumTextures: boolean;
  FastRepairUsed: number;
  LapDeltaToBestLap_OK: boolean;
  LapCompleted: number;
  ManualBoost: boolean;
  ManualNoBoost: boolean;
  ShiftPowerPct: number;
  // Laps completed in race (int)
  RaceLaps: number;
  // Session number (int)
  SessionNum: number;
  // Bit field of flags
  SessionFlags: Flags;
  // Seconds since session start
  SessionTime: number;
  SessionTimeTotal: number;
  SessionTimeRemain: number;
  // Time of day in seconds
  SessionTimeOfDay: number;
  // Session state (see enum)
  SessionState: SessionState;
  SessionTick: number;
  SessionLapsTotal: number;
  SessionUniqueID: number;
  SessionLapsRemain: number;
  SessionLapsRemainEx: number;
  SessionOnJokerLap: boolean;
  SessionJokerLapsRemain: number;

  CarLeftRight: number;

  PitsOpen: boolean;

  PitRepairLeft: number;
  PitOptRepairLeft: number;

  // Bitfield of pit service checkboxes
  PitSvFlags: PitServiceFlags;
  // Pit service fuel add amount
  PitSvFuel: number;
  PitSvTireCompound: number;
  PitSvRFP: number;
  PitSvLFP: number;
  PitSvLRP: number;
  PitSvRRP: number;

  PlayerCarDryTireSetLimit: number;
  PlayerCarClass: number;
  PlayerCarClassPosition: number;
  PlayerCarPitSvStatus: PitServiceStatus;
  PlayerCarTeamIncidentCount: number;
  PlayerCarDriverIncidentCount: number;
  PlayerCarIdx: number;
  PlayerCarMyIncidentCount: number;
  PlayerCarPosition: number;
  PlayerCarInPitStall: boolean;
  PlayerCarPowerAdjust: number;
  PlayerCarWeightPenalty: number;
  PlayerTireCompound: number;

  // Pit stop active boolean
  PitstopActive: boolean;
  DisplayUnits: number;
  IsDiskLoggingEnabled: boolean;
  IsDiskLoggingActive: boolean;
  VidCapActive: boolean;
  VidCapEnabled: boolean;
  IsInGarage: boolean;
  LapLastLapTime: number;

  RadioTransmitCarIdx: number;

  IsReplayPlaying: boolean;
  ReplayPlaySlowMotion: boolean;
  ReplaySessionNum: number;
  ReplayPlaySpeed: number;
  ReplayFrameNum: number;
  ReplayFrameNumEnd: number;
  ReplaySessionTime: number;

  SteeringWheelAngle: number;
  SteeringWheelAngleMax: number;
  SteeringWheelPctTorqueSign: number;
  SteeringWheelPeakForceNm: number;
  SteeringWheelMaxForceNm: number;
  SteeringWheelLimiter: number;
  SteeringWheelTorque: number[];
  SteeringWheelUseLinear: boolean;
  SteeringWheelPctTorque: number;
  SteeringWheelPctTorqueSignStops: number;
  SteeringWheelTorque_ST: number[];
  SteeringWheelPctDamper: number;

  TireRR_RumblePitch: number;
  TireRF_RumblePitch: number;
  TireLR_RumblePitch: number;
  TireLF_RumblePitch: number;

  LapBestLap: number;
  LapBestLapTime: number;
  LapBestNLapLap: number;
  LapBestNLapTime: number;
  LapDeltaToBestLap_DD: number;
  LapDeltaToBestLap: number;
  LapDeltaToOptimalLap_DD: number;
  LapDeltaToOptimalLap_OK: boolean;
  LapDeltaToOptimalLap: number;
  LapDeltaToSessionBestLap_OK: boolean;
  LapDeltaToSessionBestLap: number;
  LapDeltaToSessionBestLap_DD: number;
  LapDeltaToSessionLastlLap_OK: boolean;
  LapDeltaToSessionLastlLap_DD: number;
  LapDeltaToSessionLastlLap: number;
  LapDeltaToSessionOptimalLap_DD: number;
  LapDeltaToSessionOptimalLap_OK: boolean;
  LapDeltaToSessionOptimalLap: number;
  LapDist: number;
  LapLasNLapSeq: number;
  LapLastNLapTime: number;

  PaceMode: PaceMode;

  DriverMarker: boolean;
  DCLapStatus: number;
  DCDriversSoFar: number;
}

interface LiveSensorData {
  EngineWarnings: number;
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

  ManifoldPress: number;

  LRbrakeLinePress: number;
  LFbrakeLinePress: number;
  RRbrakeLinePress: number;
  RFbrakeLinePress: number;

  LFcoldPressure: number;
  LRcoldPressure: number;
  RFcoldPressure: number;
  RRcoldPressure: number;

  LapCurrentLapTime: number;
  ChanPartnerQuality: number;
  ChanQuality: number;

  OilTemp: number;
  OilPress: number;
  Speed: number;
  RPM: number;
  Engine0_RPM: number;
  ShiftGrindRPM: number;

  Gear: number;
  Clutch: number;
  Brake: number;
  BrakeRaw: number;
  Throttle: number;
  ThrottleRaw: number;
  HandbrakeRaw: number;
  Voltage: number;
  ShiftIndicatorPct: number;

  FuelLevel: number;
  FuelLevelPct: number;
  FuelPress: number;
  FuelUsePerHour: number;
  OilLevel: number;
  WaterLevel: number;

  Yaw: number;
  YawNorth: number;
  YawRate: number[];
  YawRate_ST: number[];
  Roll: number;
  RollRate: number[];
  RollRate_ST: number[];
  Pitch: number;
  PitchRate: number[];
  PitchRate_ST: number[];

  LatAccel: number[];
  LatAccel_ST: number[];
  LongAccel: number[];
  LongAccel_ST: number[];
  VertAccel: number[];
  VertAccel_ST: number[];

  VelocityX: number[];
  VelocityX_ST: number[];
  VelocityZ: number[];
  VelocityZ_ST: number[];
  VelocityY: number[];
  VelocityY_ST: number[];

  LFshockVel: number[];
  LFshockVel_ST: number[];
  LRshockVel: number[];
  LRshockVel_ST: number[];
  RFshockVel: number[];
  RFshockVel_ST: number[];
  RRshockVel: number[];
  RRshockVel_ST: number[];

  LFshockDefl: number[];
  LFshockDefl_ST: number[];
  LRshockDefl: number[];
  LRshockDefl_ST: number[];
  RFshockDefl: number[];
  RFshockDefl_ST: number[];
  RRshockDefl: number[];
  RRshockDefl_ST: number[];

  // Tire temp
  // LR
  LRtempCR: number;
  LRtempCM: number;
  LRtempCL: number;
  // LF
  LFtempCR: number;
  LFtempCM: number;
  LFtempCL: number;
  // RF
  RFtempCR: number;
  RFtempCM: number;
  RFtempCL: number;
  // RR
  RRtempCR: number;
  RRtempCM: number;
  RRtempCL: number;

  // Tire wear
  // LR
  LRwearR: number;
  LRwearM: number;
  LRwearL: number;
  // LF
  LFwearR: number;
  LFwearM: number;
  LFwearL: number;
  // RF
  RFwearR: number;
  RFwearM: number;
  RFwearL: number;
  // RR
  RRwearR: number;
  RRwearM: number;
  RRwearL: number;

  TireSetsUsed: number;
  FrontTireSetsUsed: number;
  RightTireSetsUsed: number;
  LeftTireSetsUsed: number;
  RearTireSetsUsed: number;

  TireSetsAvailable: number;
  LRTiresAvailable: number;
  LFTiresAvailable: number;
  RRTiresAvailable: number;
  RFTiresAvailable: number;
  LeftTireSetsAvailable: number;
  RightTireSetsAvailable: number;
  FrontTireSetsAvailable: number;
  RearTireSetsAvailable: number;

  LFTiresUsed: number;
  LRTiresUsed: number;
  RFTiresUsed: number;
  RRTiresUsed: number;

  FastRepairAvailable: number;

  RadioTransmitRadioIdx: number;
  RadioTransmitFrequencyIdx: number;
  WaterTemp: number;

  // Driver car values
  dcABS: number;
  dcFuelMixture: number;
  dcHeadlightFlash: boolean;
  dcStarter: boolean;
  dcBrakeBias: number;
  dcTractionControlToggle: boolean;
  dcPitSpeedLimiterToggle: boolean;
  dcTractionControl: number;

  // Driver pit stop options
  dpFuelFill: number;
  dpFuelAddKg: number;
  dpFastRepair: number;
  dpWindshieldTearoff: number;
  // Pit stop cold pressure
  dpRFTireColdPress: number;
  dpLFTireColdPress: number;
  dpRRTireColdPress: number;
  dpLRTireColdPress: number;
  // Pit stop tire change
  dpLRTireChange: number;
  dpLFTireChange: number;
  dpRRTireChange: number;
  dpRFTireChange: number;

  PushToPass: boolean;
  BrakeABSactive: boolean;
}

interface LiveWeatherData {
  AirDensity: number;
  AirPressure: number;
  AirTemp: number;
  FogLevel: number;
  RelativeHumidity: number;
  Skies: number;
  SolarAltitude: number;
  SolarAzimuth: number;
  TrackTemp: number;
  TrackTempCrew: number;
  WeatherType: number;
  WindDir: number;
  WindVel: number;
}

interface LiveCarData {
  CarIdxQualTireCompoundLocked: boolean[];
  CarIdxQualTireCompound: number[];
  CarIdxP2P_Status: boolean[];
  CarIdxBestLapNum: number[];
  CarIdxClass: number[];
  CarIdxTireCompound: number[];
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
  // Lap completed by car index (int)
  CarIdxLapCompleted: number[];
  // Percentage distance around lap by car index (float, percentage)
  CarIdxLapDistPct: number[];
  // On pit road between the cones by car index (int, boolean)
  CarIdxOnPitRoad: boolean[];
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
  CarIdxLastLapTime: number[];
  // Fast repairs used by car index (int)
  CarIdxFastRepairsUsed: number[];
  // Pace flags by car index (int, `PaceFlags`)
  CarIdxPaceFlags: PaceFlags[];
  // Pace line by car index (int)
  CarIdxPaceLine: number[];
  // Pace row by car index (int)
  CarIdxPaceRow: number[];
  // Session flags by car index
  CarIdxSessionFlags: Flags[];
  CarIdxP2P_Count: number[];
  // Track surface type of current player (int, `TrackLocation`)
  PlayerTrackSurface: TrackLocation;
  // Track surface material of current palyer (int, `TrackSurface`)
  PlayerTrackSurfaceMaterial: TrackSurface;
  PlayerCarTowTime: number;
  // Number of fast repairs used
  PlayerFastRepairsUsed: number;
  OnPitRoad: boolean;
  IsOnTrack: boolean;
  IsOnTrackCar: boolean;
  LapDistPct: number;
}

interface LiveCameraData {
  CamCameraNumber: number;
  CamCameraState: number;
  CamCarIdx: number;
  CamGroupNumber: number;
}

export interface Driver {
  AbbrevName: string;
  CarClassColor: number;
  CarClassDryTireSetLimit: string;
  CarClassEstLapTime: number;
  CarClassID: number;
  CarClassLicenseLevel: number;
  CarClassMaxFuelPct: string;
  CarClassPowerAdjust: string;
  CarClassRelSpeed: number;
  CarClassShortName: string | null;
  CarClassWeightPenalty: string;
  CarDesignStr: string;
  CarID: number;
  CarIdx: number;
  CarIsAI: number;
  CarIsElectric: number;
  CarIsPaceCar: number;
  CarNumber: string;
  CarNumberDesignStr: string;
  CarNumberRaw: number;
  CarPath: string;
  CarScreenName: string;
  CarScreenNameShort: string;
  CarSponsor_1: number;
  CarSponsor_2: number;
  ClubName: string;
  ClubID: number;
  CurDriverIncidentCount: number;
  DivisionName: string;
  DivisionID: number;
  HelmetDesignStr: string;
  Initials: string;
  IRating: number;
  IsSpectator: number;
  LicColor: number;
  LicLevel: number;
  LicString: string;
  LicSubLevel: number;
  SuitDesignStr: string;
  TeamID: number;
  TeamIncidentCount: number;
  TeamName: string;
  UserID: number;
  UserName: string;
}

export interface DriverInfo {
  DriverCarEngCylinderCount: number;
  DriverCarEstLapTime: number;
  DriverCarFuelKgPerLtr: number;
  DriverCarFuelMaxLtr: number;
  DriverCarGearNeutral: number;
  DriverCarGearNumForward: number;
  DriverCarGearReverse: number;
  DriverCarIdleRPM: number;
  DriverCarIdx: number;
  DriverCarIsElectric: number;
  DriverCarMaxFuelPct: number;
  DriverCarRedLine: number;
  DriverCarSLBlinkRPM: number;
  DriverCarSLFirstRPM: number;
  DriverCarSLLastRPM: number;
  DriverCarSLShiftRPM: number;
  DriverCarVersion: string;
  DriverHeadPosX: number;
  DriverHeadPosY: number;
  DriverHeadPosZ: number;
  DriverIncidentCount: number;
  DriverPitTrkPct: number;
  Drivers: Driver[];
  DriverSetupIsModified: number;
  DriverSetupLoadTypeName: string;
  DriverSetupName: string;
  DriverSetupPassedTech: number;
  DriverUserID: number;
  PaceCarIdx: number;
}

export interface WeekendOptions {
  CommercialMode: string;
  CourseCautions: string;
  Date: string;
  EarthRotationSpeedupFactor: number;
  FogLevel: string;
  HardcoreLevel: number;
  HasOpenRegistration: number;
  IsFixedSetup: number;
  NightMode: string;
  NumStarters: number;
  QualifyScoring: string;
  RelativeHumidity: string;
  Restarts: string;
  ShortParadeLap: number;
  Skies: string;
  StandingStart: number;
  StartingGrid: string;
  StrictLapsChecking: string;
  TimeOfDay: string;
  Unofficial: number;
  WeatherTemp: string;
  WeatherType: string;
  WindDirection: string;
  WindSpeed: string;
  NumJokerLaps: number;
  IncidentLimit: string;
  FastRepairsLimit: string;
  GreenWhiteCheckeredLimit: number;
}

export interface WeekendInfo {
  TrackName: string;
  TrackID: number;
  // meters
  TrackLength: string;
  TrackLengthOfficial: string;
  TrackDisplayName: string;
  TrackDirection: string;
  TrackVersion: string;
  TrackDisplayShortName: string;
  TrackConfigName: string;
  TrackCity: string;
  TrackCountry: string;
  TrackAltitude: string;
  HeatRacing: number;
  BuildType: string;
  BuildTarget: string;
  BuildVersion: string;
  // 6 decimal places, meters
  TrackLatitude: string;
  // 6 decimal places, meters
  TrackLongitude: string;
  // 4 decimal places, radians
  TrackNorthOffset: string;
  TrackNumTurns: number;
  TrackPitSpeedLimit: string;
  TrackType: string;
  TrackWeatherType: string;
  TrackSkies: string;
  TrackSurfaceTemp: string;
  TrackAirTemp: string;
  TrackAirPressure: string;
  TrackWindVel: string;
  TrackWindDir: string;
  TrackRelativeHumidity: string;
  TrackFogLevel: string;
  TrackCleanup: number;
  TrackDynamicTrack: number;
  SeriesID: number;
  SeasonID: number;
  SessionID: number;
  SubSessionID: number;
  LeagueID: number;
  Official: number;
  RaceWeek: number;
  EventType: string;
  Category: string;
  SimMode: string;
  TeamRacing: number;
  MinDrivers: number;
  MaxDrivers: number;
  DCRuleSet: string;
  QualifierMustStartRace: number;
  NumCarClasses: number;
  NumCarTypes: number;
  WeekendOptions: WeekendOptions;
  TelemetryOptions?: {
    TelemetryDiskFile?: string;
  };
}

export interface QualifyResultsInfoResult {
  Position: number;
  ClassPosition: number;
  CarIdx: number;
  FastestLap: number;
  FastestTime: number;
}
export interface QualifyResultsInfo {
  Results: QualifyResultsInfoResult[];
}

export interface Camera {
  CameraName: string;
  CameraNum: number;
}

export interface CameraGroup {
  Cameras: Camera[];
  GroupName: string;
  GroupNum: number;
  IsScenic?: boolean;
}

export interface CameraInfo {
  Groups: CameraGroup[];
}

interface RadioFrequency {
  FrequencyNum: number;
  FrequencyName: string;
  Priority: number;
  CarIdx: number;
  EntryIdx: number;
  ClubID: number;
  CanScan: number;
  CanSquawk: number;
  Muted: number;
  IsMutable: number;
  IsDeletable: number;
}

interface Radio {
  RadioNum: number;
  HopCount: number;
  NumFrequencies: number;
  TunedToFrequencyNum: number;
  ScanningIsOn: number;
  Frequencies: RadioFrequency[];
}

interface RadioInfo {
  SelectedRadioNum: number;
  Radios: Radio[];
}

interface Sector {
  SectorNum: number;
  SectorStartPct: number;
}

interface SplitTimeInfo {
  Sectors: Sector[];
}

export interface SessionResultsPosition {
  CarIdx: number;
  ClassPosition: number;
  FastestLap: number;
  FastestTime: number;
  Incidents: number;
  JokerLapsComplete: number;
  Lap: number;
  LapsComplete: number;
  LapsDriven: number;
  LapsLed: number;
  LastTime: number;
  Position: number;
  ReasonOutId: number;
  ReasonOutStr: string;
  Time: number;
}

export interface SessionFastestLap {
  CarIdx: number;
  FastestLap: number;
  FastestTime: number;
}

export interface Session {
  ResultsAverageLapTime: number;
  ResultsFastestLap: SessionFastestLap[];
  ResultsLapsComplete: number;
  ResultsNumCautionFlags: number;
  ResultsNumCautionLaps: number;
  ResultsNumLeadChanges: number;
  ResultsOfficial: number;
  ResultsPositions: SessionResultsPosition[];
  SessionEnforceTireCompoundChange: number;
  SessionLaps: string;
  SessionName: string;
  SessionNum: number;
  SessionNumLapsToAvg: number;
  SessionRunGroupsUsed: number;
  SessionSkipped: number;
  SessionSubType: string;
  SessionTime: string;
  SessionTrackRubberState: string;
  SessionType: string;
}

export interface SessionInfo {
  NumSessions: number;
  Sessions: Session[];
}

interface SessionStringData {
  WeekendInfo: Partial<WeekendInfo>;
  DriverInfo: Partial<DriverInfo>;
  SessionInfo: Partial<SessionInfo>;
  QualifyResultsInfo: Partial<QualifyResultsInfo>;
  CameraInfo: Partial<CameraInfo>;
  RadioInfo: Partial<RadioInfo>;
  SplitTimeInfo: Partial<SplitTimeInfo>;
}

// !!!: It's all partial cause it's not guaranteed that a socket will be asking for all
// of it, nor is it guaranteed to come back. You get what you get ¯\_(ツ)_/¯
export interface iRacingData
  extends Partial<LiveData>,
    Partial<LiveSensorData>,
    Partial<LiveCarData>,
    Partial<LiveCameraData>,
    Partial<LiveWeatherData>,
    Partial<SessionStringData> {}

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
  Serviceable = 0x040000, // car is allowed service (not a flag)
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

export enum ChatCommand {
  BeginChat = 1,
  Reply,
  Cancel,
}

export enum PitCommandMode {
  Clear = 0,
  Windshield,
  Fuel,
  LF,
  RF,
  LR,
  RR,
  ClearTires,
  FR,
}

export enum ReplaySearchCommand {
  ToStart = 0,
  ToEnd,
  ToPreviousSession,
  ToNextSession,
  PreviousLap,
  NextLap,
  PreviousFrame,
  NextFrame,
  PreviousIncident,
  NextIncident,
}

export enum ReplayPlayPosition {
  Begin = 0,
  Current,
  End,
}

export enum TelemetryCommand {
  Start = 0,
  Stop,
  Restart,
}

export enum iRacingSocketCommands {
  CameraSwitchPosition = "cam_switch_pos",
  CameraSwitchNumber = "cam_switch_num",
  CameraSetState = "cam_set_state",
  ReplaySetPlaySpeed = "replay_set_play_speed",
  ReplaySetPlayPosition = "replay_set_play_position",
  ReplaySearch = "replay_search",
  ReplaySetState = "replay_set_state",
  ReloadAllTextures = "reload_all_textures",
  ReloadTexture = "reload_texture",
  ChatCommand = "chat_command",
  ChatCommandMacro = "chat_command_macro",
  PitCommand = "pit_command",
  TelemetryCommand = "telem_command",
  FFBCommand = "ffb_command",
  ReplaySearchSessionTime = "replay_search_session_time",
  VideoCapture = "video_capture",
}

export interface SocketCommandEventMap {
  [iRacingSocketCommands.CameraSwitchPosition]: [number, number, number];
  [iRacingSocketCommands.CameraSwitchNumber]: [string, number, number];
  [iRacingSocketCommands.CameraSetState]: [CameraState];
  [iRacingSocketCommands.ReplaySetPlaySpeed]: [number, boolean];
  [iRacingSocketCommands.ReplaySetPlayPosition]: [number, number];
  [iRacingSocketCommands.ReplaySearch]: [ReplaySearchCommand];
  [iRacingSocketCommands.ReplaySetState]: [0];
  [iRacingSocketCommands.ReloadAllTextures]: undefined;
  [iRacingSocketCommands.ReloadTexture]: [number];
  [iRacingSocketCommands.ChatCommand]: [ChatCommand];
  [iRacingSocketCommands.ChatCommandMacro]: [number];
  [iRacingSocketCommands.PitCommand]: [PitCommandMode, number | 0];
  [iRacingSocketCommands.TelemetryCommand]: [TelemetryCommand];
  [iRacingSocketCommands.FFBCommand]: [FFBCommandMode, number];
  [iRacingSocketCommands.ReplaySearchSessionTime]: [number, number];
  [iRacingSocketCommands.VideoCapture]: [VideoCaptureMode];
}
