import { iRacingSocket, iRacingSocketConsumer, iRacingSocketOptions } from "../core";
import { iRacingDataKey, TrackLocation } from "../types";
export declare enum PitTimingEvents {
    PitEntry = "PitEntry",
    PitExit = "PitExit",
    PitBoxEntry = "PitBoxEntry",
    PitBoxExit = "PitBoxExit",
    PitServiceStart = "PitServiceStart",
    PitServiceEnd = "PitServiceEnd",
    PitServiceError = "PitServiceError"
}
export interface PitTimingConsumerOptions {
    socket: iRacingSocket | iRacingSocketOptions;
}
export declare class PitTimingConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    protected trackLocation: TrackLocation;
    protected isOnPitRoad: boolean;
    protected isPitStopActive: boolean;
    onUpdate: (keys: any) => void;
}
//# sourceMappingURL=pitTimingConsumer.d.ts.map