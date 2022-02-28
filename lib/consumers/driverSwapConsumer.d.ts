import { iRacingSocketConsumer } from "../core";
import { Driver } from "../types";
export declare const IRACING_REQUEST_PARAMS: string[];
export declare type DriverSwapFragment = Pick<Driver, "UserID">;
export interface DriverSwapEvent {
    from?: Driver;
    to: Driver;
}
export declare type DriverSwapIndex = Record<number, DriverSwapEvent>;
export declare const getDriverSwapIndex: (previousIndex: Record<number, DriverSwapFragment>, nextIndex: Record<number, DriverSwapFragment>) => DriverSwapIndex;
export declare enum DriverSwapEvents {
    DriverSwaps = "driverSwaps"
}
export declare class DriverSwapConsumer extends iRacingSocketConsumer {
    private driverIndex;
    onUpdate: (keys: string[]) => void;
}
//# sourceMappingURL=driverSwapConsumer.d.ts.map