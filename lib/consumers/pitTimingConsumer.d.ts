import { iRacingSocketConsumer } from "../core";
import { iRacingDataKey, PitServiceFlags, TrackLocation } from "../types";
export declare enum PitTimingEvents {
    PitEntry = "PitEntry",
    PitExit = "PitExit",
    PitBoxEntry = "PitBoxEntry",
    PitBoxExit = "PitBoxExit",
    PitServiceStart = "PitServiceStart",
    PitServiceEnd = "PitServiceEnd",
    PitServiceStatus = "PitServiceStatus",
    PitServiceRequest = "PitServiceRequest",
    PitServiceFuelLevelRequest = "PitServiceFuelLevelRequest",
    PitServiceTirePressureLevelRequest = "PitServiceTirePressureLevelRequest"
}
export declare class PitTimingConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    protected trackLocation: TrackLocation;
    protected isOnPitRoad: boolean;
    protected isPitStopActive: boolean;
    private _serviceFlags;
    get serviceFlags(): PitServiceFlags;
    private _fuelAmount;
    get fuelAmount(): number;
    onUpdate: (keys: any) => void;
}
//# sourceMappingURL=pitTimingConsumer.d.ts.map