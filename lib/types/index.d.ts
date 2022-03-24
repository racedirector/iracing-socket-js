export declare const PACE_CAR_CLASS_ID = 11;
interface LiveData {
    RaceLaps: number;
    SessionNum: number;
    SessionFlags: Flags;
    SessionTime: number;
    SessionTimeOfDay: number;
    PitSvFlags: PitServiceFlags;
    PitSvFuel: number;
    PlayerCarPitSvStatus: PitServiceFlags;
    PitstopActive: boolean;
}
interface LiveSensorData {
    CFrideHeight: number;
    CFshockDefl: number;
    CFshockVel: number;
    CFSRrideHeight: number;
    CRrideHeight: number;
    CRshockDefl: number;
    CRshockVel: number;
}
interface LiveCarData {
    CarIdxClassPosition: number[];
    CarIdxEstTime: number[];
    CarIdxF2Time: number[];
    CarIdxGear: number[];
    CarIdxLap: number[];
    CarIdxLapCompleted: number[];
    CarIdxLapDistPct: number[];
    CarIdxOnPitRoad: number[];
    CarIdxPosition: number[];
    CarIdxRPM: number[];
    CarIdxSteer: number[];
    CarIdxTrackSurface: TrackLocation[];
    CarIdxTrackSurfaceMaterial: TrackSurface[];
    CarIdxBestLapTime: number[];
    CarIdxFastRepairsUsed: number[];
    CarIdxPaceFlags: PaceFlags[];
    CarIdxPaceLine: number[];
    CarIdxPaceRow: number[];
    CarIdxSessionFlags: Flags[];
    PlayerTrackSurface: TrackLocation;
    PlayerTrackSurfaceMaterial: TrackSurface;
    PlayerCarTowTime: number;
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
export interface iRacingData extends Partial<LiveData>, Partial<LiveSensorData>, Partial<LiveCarData>, Partial<SessionStringData> {
}
export declare type iRacingDataKey = keyof iRacingData;
export declare type DriverIndex = Record<number, Driver>;
export declare enum Flags {
    Checkered = 1,
    White = 2,
    Green = 4,
    Yellow = 8,
    Red = 16,
    Blue = 32,
    Debris = 64,
    Crossed = 128,
    YellowWaving = 256,
    OneLapToGreen = 512,
    GreenHeld = 1024,
    TenToGo = 2048,
    FiveToGo = 4096,
    RandomWaving = 8192,
    Caution = 16384,
    CautionWaving = 32768,
    Black = 65536,
    Disqualify = 131072,
    Servicible = 262144,
    Furled = 524288,
    Repair = 1048576,
    StartHidden = 268435456,
    StartReady = 536870912,
    StartSet = 1073741824,
    StartGo = 2147483648
}
export declare enum TrackLocation {
    NotInWorld = -1,
    OffTrack = 0,
    InPitStall = 1,
    ApproachingPits = 2,
    OnTrack = 3
}
export declare enum TrackSurface {
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
    Astroturf = 27
}
export declare enum SessionState {
    Invalid = 0,
    GetInCar = 1,
    Warmup = 2,
    ParadeLaps = 3,
    Racing = 4,
    Checkered = 5,
    CoolDown = 6
}
export declare enum CameraState {
    IsSessionScreen = 1,
    IsScenicActive = 2,
    CamToolActive = 4,
    UiHidden = 8,
    UseAutoShotSelection = 16,
    UseTemporaryEdits = 32,
    UseKeyAcceleration = 64,
    UseKey10xAcceleration = 128,
    UseMouseAimMode = 256
}
export declare enum PitServiceFlags {
    LFChange = 1,
    RFChange = 2,
    LRChange = 4,
    RRChange = 8,
    Fuel = 16,
    WindshieldTearoff = 32,
    FastRepair = 64
}
export declare enum PitServiceStatus {
    None = 0,
    InProgress = 1,
    Complete = 2,
    TooFarLeft = 100,
    TooFarRight = 101,
    TooFarForward = 102,
    TooFarBack = 103,
    BadAngle = 104,
    CantFixThat = 105
}
export declare enum PaceMode {
    SingleFileStart = 0,
    DoubleFileStart = 1,
    SingleFileRestart = 2,
    DoubleFileRestart = 3,
    NotPacing = 4
}
export declare enum PaceFlags {
    EndOfLine = 1,
    FreePass = 2,
    WavedAround = 4
}
export declare enum CarLeftRight {
    Clear = 1,
    CarLeft = 2,
    CarRight = 3,
    CarLeftRight = 4,
    TwoCarsLeft = 5,
    TwoCarsRight = 6
}
export declare enum FFBCommandMode {
    FFBCommandMaxForce = 0
}
export declare enum VideoCaptureMode {
    TriggerScreenShot = 0,
    StartVideoCapture = 1,
    EndVideoCapture = 2,
    ToggleVideoCapture = 3,
    ShowVideoTimer = 4,
    HideVideoTimer = 5
}
export {};
//# sourceMappingURL=index.d.ts.map