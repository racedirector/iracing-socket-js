import { chain, isEmpty } from "lodash";
import {
  iRacingSocketConsumer,
  Driver,
  iRacingDataKey,
} from "@racedirector/iracing-socket-js";

export interface DriverSwapEvent {
  from?: Driver;
  to: Driver;
}

export type DriverSwapIndex = Record<string, DriverSwapEvent>;

export enum DriverSwapEvents {
  DriverSwaps = "driverSwaps",
}

export class DriverSwapConsumer extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = ["DriverInfo"];

  private _driverIndex: Record<string, Driver>;
  public get driverIndex() {
    return this._driverIndex;
  }

  onUpdate = (keys: string[]): void => {
    // Only run if there's an update to DriverInfo
    if (!keys.includes("DriverInfo")) {
      return;
    }

    const nextData = { ...this.socket.data };
    // !!!: Don't include the pace car
    const nextIndex: Record<string, Driver> = chain(
      nextData.DriverInfo?.Drivers || [],
    )
      .filter(({ CarIsPaceCar }) => !CarIsPaceCar)
      .keyBy("CarIdx")
      .value();

    if (this.driverIndex) {
      const driverSwaps = Object.entries(nextIndex).reduce(
        (swapIndex, [carIndex, driver]) => {
          // Get the existing driver, if any
          const existingDriver = this.driverIndex?.[carIndex] || undefined;
          // A driver swap is considered if the existing driver exists and the current driver
          // UserID does not match, or if the existing driver doesn't exist (new entry?)
          const isDriverSwap = existingDriver
            ? driver.UserID !== existingDriver.UserID
            : true;

          if (isDriverSwap) {
            return {
              ...swapIndex,
              [carIndex]: {
                from: existingDriver,
                to: driver,
              },
            };
          }

          return swapIndex;
        },
        {},
      );
      if (!isEmpty(driverSwaps)) {
        this.emit(DriverSwapEvents.DriverSwaps, driverSwaps);
      }
    }

    this._driverIndex = nextIndex;
  };
}
