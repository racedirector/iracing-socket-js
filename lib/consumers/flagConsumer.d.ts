import { Flags, iRacingDataKey } from "../types";
import { iRacingSocketConsumer } from "../core";
export declare enum FlagsEvents {
    FlagChange = "flagChange"
}
export declare class FlagsConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    private _previousFlags;
    get flags(): Flags;
    onUpdate: (keys: string[]) => void;
}
export default FlagsConsumer;
//# sourceMappingURL=flagConsumer.d.ts.map