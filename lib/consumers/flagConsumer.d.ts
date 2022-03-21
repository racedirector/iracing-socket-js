import { Flags, iRacingDataKey } from "../types";
import { iRacingSocketConsumer } from "../core";
export declare enum FlagsEvents {
    FlagChange = "flagChange"
}
export declare class SimIncidentsConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    private _previousFlags;
    get flags(): Flags;
    onUpdate: (keys: string[]) => void;
}
export default SimIncidentsConsumer;
//# sourceMappingURL=flagConsumer.d.ts.map