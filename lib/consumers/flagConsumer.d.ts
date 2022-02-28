import { Flags } from "../types";
import { iRacingSocketConsumer } from "../core";
export declare const IRACING_REQUEST_PARAMS: string[];
export declare enum FlagsConsumerEvents {
    FlagChange = "flagChange"
}
export declare class FlagsConsumer extends iRacingSocketConsumer {
    private _previousFlags;
    get flags(): Flags;
    onUpdate: (keys: string[]) => void;
}
export default FlagsConsumer;
//# sourceMappingURL=flagConsumer.d.ts.map