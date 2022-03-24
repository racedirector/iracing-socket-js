import { iRacingSocketConsumer } from "../core";
import { Driver, iRacingDataKey } from "../types";
export interface DriverSwapEvent {
    from?: Driver;
    to: Driver;
}
export declare type DriverSwapIndex = Record<string, DriverSwapEvent>;
export declare enum DriverSwapEvents {
    DriverSwaps = "driverSwaps"
}
export declare class DriverSwapConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    private _driverIndex;
    get driverIndex(): Record<string, Driver>;
    onUpdate: (keys: string[]) => void;
}
//# sourceMappingURL=driverSwapConsumer.d.ts.map