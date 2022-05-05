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
  PitstopActive: boolean;
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
  // Lap completed by car index (int)
  CarIdxLapCompleted: number[];
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

  // Track surface type of current player (int, `TrackLocation`)
  PlayerTrackSurface: TrackLocation;
  // Track surface material of current palyer (int, `TrackSurface`)
  PlayerTrackSurfaceMaterial: TrackSurface;
  PlayerCarTowTime: number;
  // Number of fast repairs used
  PlayerFastRepairsUsed: number;
  OnPitRoad: boolean;
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

export interface DriverInfo {
  DriverCarIdx: number;
  DriverHeadPosX: number;
  DriverHeadPosY: number;
  DriverHeadPosZ: number;
  DriverCarIdleRPM: number;
  DriverCarRedLine: number;
  DriverCarFuelKgPerLtr: number;
  DriverCarFuelMaxLtr: number;
  DriverCarMaxFuelPct: number;
  DriverCarSLFirstRPM: number;
  DriverCarSLShiftRPM: number;
  DriverCarSLLastRPM: number;
  DriverCarSLBlinkRPM: number;
  DriverPitTrkPct: number;
  DriverCarEstLapTime: number;
  DriverSetupName: string;
  DriverSetupIsModified: number;
  DriverSetupLoadTypeName: string;
  DriverSetupPassedTech: number;
  Drivers: Driver[];
}

export interface WeekendOptions {
  NumStarters: number;
  StartingGrid: string;
  QualifyScoring: string;
  CourseCautions: string;
  StandingStart: number;
  Restarts: string;
  WeatherType: string;
  Skies: string;
  WindDirection: string;
  WindSpeed: number;
  WeatherTemp: number;
  RelativeHumidity: number;
  FogLevel: number;
  Unofficial: number;
  CommercialMode: string;
  NightMode: number;
  IsFixedSetup: number;
  StrictLapsChecking: string;
  HasOpenRegistration: number;
  HardcoreLevel: number;
}

export interface WeekendInfo {
  TrackName: string;
  TrackID: number;
  // meters
  TrackLength: string;
  TrackDisplayName: string;
  TrackDisplayShortName: string;
  TrackConfigName: string;
  TrackCity: string;
  TrackCountry: string;
  TrackAltitude: number;
  // 6 decimal places, meters
  TrackLatitude: number;
  // 6 decimal places, meters
  TrackLongitude: number;
  // 4 decimal places, radians
  TrackNorthOffset: number;
  TrackNumTurns: number;
  TrackPitSpeedLimit: number;
  TrackType: string;
  TrackWeatherType: string;
  TrackSkies: string;
  TrackSurfaceTemp: number;
  TrackAirTemp: number;
  TrackAirPressure: number;
  TrackWindVel: number;
  TrackWindDir: number;
  TrackRelativeHumidity: number;
  TrackFogLevel: number;
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
}

interface QualifyResultsInfo {
  [key: string]: any;
}

interface CameraInfo {
  [key: string]: any;
}

interface RadioInfo {
  [key: string]: any;
}

interface Sector {
  SectorNum: number;
  SectorStartPct: number;
}

interface SplitTimeInfo {
  Sectors: Sector[];
}

interface Session {
  SessionNum: number;
  SessionLaps: number;
  SessionTime: number;
  SessionNumLapsToAvg: number;
  SessionType: string;
  SessionTrackRubberState: string;
}

interface SessionInfo {
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
  [iRacingSocketCommands.ReplaySearch]: [];
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
