import { iRacingSocketConsumer, Driver } from 'iracing-socket-js';
export declare const IRACING_REQUEST_PARAMS: string[];
export declare type DriverSwapFragment = Pick<Driver, 'UserID'>;
export interface DriverSwapEvent {
    from?: Driver;
    to: Driver;
}
export declare type DriverSwapIndex = Record<number, DriverSwapEvent>;
export declare const getDriverSwapIndex: (previousIndex: Record<number, DriverSwapFragment>, nextIndex: Record<number, DriverSwapFragment>) => DriverSwapIndex;
export declare enum DriverSwapObserverEvents {
    DriverSwaps = "driverSwaps"
}
export declare class DriverSwapObserver extends iRacingSocketConsumer {
    private driverIndex;
    onUpdate: (keys: string[]) => void;
}
//# sourceMappingURL=driverSwapObserver.d.ts.map