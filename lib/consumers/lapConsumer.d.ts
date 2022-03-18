import { iRacingSocketConsumer } from "../core";
import { iRacingDataKey, Flags } from "../types";
export declare enum LapEvents {
    LapChange = "lapChange"
}
export declare class LapConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    private _currentLap;
    get currentLap(): number;
    private _flags;
    get flags(): Flags;
    private _greenLaps;
    get greenLaps(): number[];
    private _cautionLaps;
    get cautionLaps(): number[];
    private _restartLaps;
    get restartLaps(): number[];
    get isCaution(): boolean;
    private trackLaps;
    onUpdate: (keys: string[]) => void;
}
export default LapConsumer;
//# sourceMappingURL=lapConsumer.d.ts.map