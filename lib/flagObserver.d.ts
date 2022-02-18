import { iRacingSocketConsumer } from "./socketConsumer";
export declare const IRACING_REQUEST_PARAMS: string[];
export declare enum FlagsObserverEvents {
    FlagChange = "flagChange"
}
export declare class FlagsObserver extends iRacingSocketConsumer {
    private previousFlags;
    onUpdate: (keys: string[]) => void;
}
export default FlagsObserver;
