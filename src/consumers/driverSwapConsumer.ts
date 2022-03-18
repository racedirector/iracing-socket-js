import { isEmpty, keyBy } from "lodash";
import { iRacingSocketConsumer } from "../core";
import { Driver, iRacingDataKey } from "../types";

export type DriverSwapFragment = Pick<Driver, "UserID">;

export interface DriverSwapEvent {
  from?: Driver;
  to: Driver;
}

export type DriverSwapIndex = Record<number, DriverSwapEvent>;

export const getDriverSwapIndex = (
  previousIndex: Record<number, DriverSwapFragment>,
  nextIndex: Record<number, DriverSwapFragment>,
): DriverSwapIndex => {
  return Object.entries(nextIndex).reduce((swapIndex, [carIndex, driver]) => {
    // Get the existing driver, if any
    const existingDriver = previousIndex?.[carIndex] || undefined;
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
  }, {});
};

export enum DriverSwapEvents {
  DriverSwaps = "driverSwaps",
}

export class DriverSwapConsumer extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = ["DriverInfo"];

  private driverIndex: Record<number, Driver>;

  onUpdate = (keys: string[]): void => {
    if (keys.includes("DriverInfo")) {
      const nextData = { ...this.socket.data };
      const nextIndex = keyBy(nextData.DriverInfo?.Drivers || [], "CarIdx");

      if (this.driverIndex) {
        const driverSwaps = getDriverSwapIndex(this.driverIndex, nextIndex);
        if (!isEmpty(driverSwaps)) {
          this.emit(DriverSwapEvents.DriverSwaps, driverSwaps);
        }
      }

      this.driverIndex = nextIndex;
    }
  };
}
