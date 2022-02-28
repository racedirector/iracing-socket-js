import { iRacingSocket, iRacingSocketConsumer, iRacingSocketOptions, TrackLocation } from 'iracing-socket-js';
export declare const IRACING_REQUEST_PARAMS: string[];
export declare const IRACING_REQUEST_PARAMS_ONCE: any[];
export declare enum PitTimingEvents {
    PitEntry = "PitEntry",
    PitExit = "PitExit",
    PitBoxEntry = "PitBoxEntry",
    PitBoxExit = "PitBoxExit",
    PitServiceStart = "PitServiceStart",
    PitServiceEnd = "PitServiceEnd",
    PitServiceError = "PitServiceError"
}
export interface PitTimingOptions {
    socket: iRacingSocket | iRacingSocketOptions;
}
export declare class PitTiming extends iRacingSocketConsumer {
    protected trackLocation: TrackLocation;
    protected isOnPitRoad: boolean;
    protected isPitStopActive: boolean;
    protected onUpdate: (keys: any) => void;
}
//# sourceMappingURL=pitTiming.d.ts.map