import {
  iRacingSocketConsumer,
  Driver,
  Flags,
  iRacingDataKey,
} from "@racedirector/iracing-socket-js";
import { flagsHasFlag } from "@racedirector/iracing-utilities";
import { chain, isEmpty } from "lodash";

/**
 * All events that `FlagsConsumer` can emit.
 */
export enum FlagsEvents {
  // Event fired when the session flags change
  FlagChange = "flagChange",
  // Event fired with an index of updates to flags by car index
  FlagIndexChange = "flagIndexChange",
  // Event fired with an index of all drivers recieving a black flag
  BlackFlag = "blackFlag",
  // Event fired with an index of all drivers receiving a meatball
  Meatball = "meatball",
  // Event fired with an index of all drivers receiving a DQ
  DQ = "disqualify",
  // Event fired with an index of all drivers receiving a serviceable flag
  Serviceible = "serviceible",
  // Event fired with an index of all drivers receiving a furled black flag
  Furled = "furled",
}

type FlagChangeEvent = {
  previousFlag?: Flags;
  nextFlag: Flags;
};

type FlagChangeIndex = Record<string, FlagChangeEvent>;

/**
 * A `FlagsConsumer` is a derived implementation of `iRacingSocketConsumer` to
 * emit timestamped events for `SessionFlags` changes.
 */
export class FlagsEmitter extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = [
    "DriverInfo",
    "SessionFlags",
    "SessionTime",
    "SessionTimeOfDay",
    "CarIdxSessionFlags",
    "CarIdxLapDistPct",
  ];

  private _driverIndex: Record<string, Driver> = {};

  get driverIndex(): Record<string, Driver> {
    return this._driverIndex;
  }

  private _previousFlags: Flags;

  get flags(): Flags {
    return this._previousFlags;
  }

  private _flagIndex: Record<string, Flags> = {};
  get flagIndex(): Record<string, Flags> {
    return this._flagIndex;
  }

  /**
   * Handle update events
   * @param keys the changed keys
   * @fires FlagsConsumer.flagChange
   */
  onUpdate = (keys: string[]) => {
    const {
      SessionFlags: sessionFlags,
      SessionTime: sessionTime,
      SessionTimeOfDay: sessionTimeOfDay,
      CarIdxSessionFlags: carIdxSessionFlags = [],
      CarIdxLapDistPct: carIdxLapDistPct = [],
      DriverInfo: driverInfo,
    } = this.socket.data;

    if (keys.includes("DriverInfo")) {
      this.updateDriverIndex(driverInfo?.Drivers || []);
    }

    if (keys.includes("SessionFlags")) {
      this.updateSessionFlags(sessionFlags, sessionTime, sessionTimeOfDay);
    }

    if (keys.includes("CarIdxSessionFlags")) {
      this.updateFlagIndex(
        carIdxSessionFlags,
        carIdxLapDistPct,
        sessionTime,
        sessionTimeOfDay,
      );
    }
  };

  private updateDriverIndex = (drivers: Driver[]) => {
    this._driverIndex = chain(drivers)
      .filter(({ CarIsPaceCar }) => !CarIsPaceCar)
      .keyBy("CarIdx")
      .value();
  };

  private updateSessionFlags = (
    nextFlags: Flags,
    sessionTime: number,
    sessionTimeOfDay: number,
  ) => {
    if (nextFlags !== this._previousFlags) {
      /**
       * Flag change event
       * @event FlagsConsumer.flagChange
       * @param {Flags} previousFlags The previous flag value
       * @param {Flags} flags The next flag value
       * @param {number} sessionTime The session time
       * @param {number} sessionTimeOfDay The session time of day
       */
      this.emit(
        FlagsEvents.FlagChange,
        this._previousFlags,
        nextFlags,
        sessionTime,
        sessionTimeOfDay,
      );

      this._previousFlags = nextFlags;
    }
  };

  private updateFlagIndex = (
    flags: Flags[],
    lapPercentages: number[],
    sessionTime: number,
    sessionTimeOfDay: number,
  ) => {
    // Iterate through the known drivers and get the flags they're currently shown
    const flagIndex = Object.keys(this._driverIndex).reduce(
      (flagIndex, carIndex) => ({
        ...flagIndex,
        [carIndex]: flags[carIndex],
      }),
      {},
    );

    const updateIndex: FlagChangeIndex = Object.entries(flagIndex).reduce(
      (index, [carIndex, flag]) => {
        const previousFlag = this._flagIndex[carIndex] || -1;

        if (previousFlag !== flag) {
          return {
            ...index,
            [carIndex]: {
              previousFlag,
              nextFlag: flag,
              lapPercentage: lapPercentages[carIndex],
            },
          };
        }

        return index;
      },
      {},
    );

    if (!isEmpty(updateIndex)) {
      this._flagIndex = flagIndex;
      this.emit(
        FlagsEvents.FlagIndexChange,
        updateIndex,
        sessionTime,
        sessionTimeOfDay,
      );

      this.updateBlackFlags(updateIndex);
    }
  };

  private updateBlackFlags = (updateIndex: FlagChangeIndex) => {
    const updateEntries = Object.entries(updateIndex);

    // Check for DQ
    const disqualifiedDrivers: number[] = updateEntries.reduce(
      (carIndexes, [carIndex, { nextFlag }]) =>
        flagsHasFlag(nextFlag, Flags.Disqualify)
          ? [...carIndexes, carIndex]
          : carIndexes,
      [],
    );

    if (!isEmpty(disqualifiedDrivers)) {
      this.emit(FlagsEvents.DQ, disqualifiedDrivers);
    }

    // Check for meatball
    const meatballedDrivers: number[] = updateEntries.reduce(
      (carIndexes, [carIndex, { nextFlag }]) =>
        flagsHasFlag(nextFlag, Flags.Repair)
          ? [...carIndexes, carIndex]
          : carIndexes,
      [],
    );

    if (!isEmpty(meatballedDrivers)) {
      this.emit(FlagsEvents.Meatball, meatballedDrivers);
    }

    // Check for service
    const serviceibleDrivers: number[] = updateEntries.reduce(
      (carIndexes, [carIndex, { nextFlag }]) =>
        flagsHasFlag(nextFlag, Flags.Serviceable)
          ? [...carIndexes, carIndex]
          : carIndexes,
      [],
    );

    if (!isEmpty(serviceibleDrivers)) {
      this.emit(FlagsEvents.Serviceible, serviceibleDrivers);
    }

    // Check for furled
    const warnedDrivers: number[] = updateEntries.reduce(
      (carIndexes, [carIndex, { nextFlag }]) =>
        flagsHasFlag(nextFlag, Flags.Furled)
          ? [...carIndexes, carIndex]
          : carIndexes,
      [],
    );

    if (!isEmpty(warnedDrivers)) {
      this.emit(FlagsEvents.Furled, warnedDrivers);
    }

    // Check for penalty
    const penalizedDrivers: number[] = updateEntries.reduce(
      (carIndexes, [carIndex, { nextFlag }]) =>
        flagsHasFlag(nextFlag, Flags.Black)
          ? [...carIndexes, carIndex]
          : carIndexes,
      [],
    );

    if (!isEmpty(penalizedDrivers)) {
      this.emit(FlagsEvents.BlackFlag, penalizedDrivers);
    }
  };
}

export default FlagsEmitter;
