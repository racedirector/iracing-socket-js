import {
  iRacingSocketConsumer,
  Driver,
  Flags,
  iRacingDataKey,
} from "@racedirector/iracing-socket-js";
import chain from "lodash/chain";

/**
 * All events that `FlagsConsumer` can emit.
 */
export enum FlagsEvents {
  // Event fired when the session flags change
  FlagChange = "flagChange",
  // Event fired with an index of updates to flags by car index
  FlagIndexChange = "flagIndexChange",
}

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
  ];

  private _driverIndex: Record<string, Driver>;

  private _previousFlags: Flags;

  get flags(): Flags {
    return this._previousFlags;
  }

  private _flagIndex: Record<string, Flags>;
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
      DriverInfo: driverInfo,
    } = this.socket.data;

    if (keys.includes("DriverInfo")) {
      this.updateDriverIndex(driverInfo.Drivers || []);
    }

    if (keys.includes("SessionFlags")) {
      this.updateSessionFlags(sessionFlags, sessionTime, sessionTimeOfDay);
    }

    if (keys.includes("CarIdxSessionFlags")) {
      this.updateFlagIndex(carIdxSessionFlags, sessionTime, sessionTimeOfDay);
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

    const updateIndex = Object.entries(flagIndex).reduce(
      (index, [carIndex, flag]) => {
        const previousFlag = this._flagIndex[carIndex] || -1;

        if (previousFlag !== flag) {
          return {
            ...index,
            [carIndex]: {
              previousFlag,
              nextFlag: flag,
            },
          };
        }

        return index;
      },
      {},
    );

    this._flagIndex = flagIndex;
    this.emit(
      FlagsEvents.FlagIndexChange,
      updateIndex,
      sessionTime,
      sessionTimeOfDay,
    );
  };
}

export default FlagsEmitter;
