import {
  iRacingSocketConsumer,
  Driver,
  Flags,
  PaceFlags,
  TrackLocation,
  iRacingDataKey,
} from "@racedirector/iracing-socket-js";
// import { flagsHasFlags } from "@racedirector/iracing-utilities";
import { chain, isEmpty } from "lodash";

// const BLACK_FLAGS: Flags[] = [
//   Flags.Disqualify,
//   Flags.Repair,
//   Flags.Serviceable,
//   Flags.Furled,
//   Flags.Black,
// ];

/**
 * All events that `FlagsConsumer` can emit.
 */
export enum FlagsEvents {
  // Event fired when the session flags change
  FlagChange = "flagChange",
  // Event fired with an index of updates to flags by car index
  FlagIndexChange = "flagIndexChange",
  // Event fired with an index of updates to pace flags by car index
  PaceFlagIndexChange = "paceFlagIndexChange",
}

// type FlagChangeEvent = {
//   previousFlags?: Flags;
//   nextFlags: Flags;
//   trackLocation: TrackLocation;
//   lapPercentage: number;
// };

// type PaceFlagChangeEvent = {
//   previousPaceFlags?: PaceFlags;
//   nextPaceFlags: PaceFlags;
// };

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
    "CarIdxTrackSurface",
    "CarIdxPaceFlags",
    "CarIdxPaceLine",
    "CarIdxPaceRow",
  ];

  // Tracks the drivers in the session
  private _driverIndex: Record<string, Driver> = {};
  get driverIndex(): Record<string, Driver> {
    return this._driverIndex;
  }

  // Tracks the session flags
  private _previousFlags: Flags;
  get flags(): Flags {
    return this._previousFlags;
  }

  // Tracks the flags by car index
  private _flagIndex: Record<string, Flags> = {};
  get flagIndex(): Record<string, Flags> {
    return this._flagIndex;
  }

  // Tracks the pace flags by car index
  private _paceFlagIndex: Record<string, PaceFlags> = {};
  get paceFlagIndex(): Record<string, PaceFlags> {
    return this._paceFlagIndex;
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
      CarIdxTrackSurface: carIdxTrackSurface = [],
      CarIdxPaceFlags: carIdxPaceFlags = [],
      DriverInfo: { Drivers: drivers = [] },
    } = this.socket.data;

    // !!!: Ensure the driver index is updated first.
    if (keys.includes("DriverInfo")) {
      this.updateDriverIndex(drivers);
    }

    // Check for updates to the session flags, if necessary.
    if (keys.includes("SessionFlags")) {
      this.updateSessionFlags(sessionFlags, sessionTime, sessionTimeOfDay);
    }

    // Check for updates to the flags for a car index, if necessary.
    if (keys.includes("CarIdxSessionFlags")) {
      this.updateFlagIndex(
        carIdxSessionFlags,
        carIdxLapDistPct,
        carIdxTrackSurface,
        sessionTime,
        sessionTimeOfDay,
      );
    }

    // Check for updates to the pace flags for a car index, if necessary.
    if (keys.includes("CarIdxPaceFlags")) {
      this.updatePaceFlagIndex(
        carIdxPaceFlags,
        carIdxLapDistPct,
        carIdxTrackSurface,
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
    trackSurfaces: TrackLocation[],
    sessionTime: number,
    sessionTimeOfDay: number,
  ) => {
    const updateIndex = Object.keys(this._driverIndex).reduce(
      (flagIndex, carIndex) => {
        const nextFlags = flags[carIndex];
        const previousFlags = this._flagIndex[carIndex];

        if (previousFlags !== nextFlags) {
          this._flagIndex[carIndex] = nextFlags;
          return {
            ...flagIndex,
            [carIndex]: {
              previousFlags,
              nextFlags,
              lapPercentage: lapPercentages[carIndex],
              trackLocation: trackSurfaces[carIndex],
            },
          };
        }

        return flagIndex;
      },
      {},
    );

    if (!isEmpty(updateIndex)) {
      this.emit(
        FlagsEvents.FlagIndexChange,
        updateIndex,
        sessionTime,
        sessionTimeOfDay,
      );
    }
  };

  private updatePaceFlagIndex = (
    paceFlags: PaceFlags[],
    lapPercentages: number[],
    trackSurfaces: TrackLocation[],
    sessionTime: number,
    sessionTimeOfDay: number,
  ) => {
    // Iterate through the known drivers and get the flags they're currently shown
    const updateIndex = Object.keys(this._driverIndex).reduce(
      (flagIndex, carIndex) => {
        const nextPaceFlags = paceFlags[carIndex];
        const previousPaceFlags = this._paceFlagIndex[carIndex];

        if (previousPaceFlags !== nextPaceFlags) {
          this._paceFlagIndex[carIndex] = nextPaceFlags;
          return {
            ...flagIndex,
            [carIndex]: {
              previousPaceFlags,
              nextPaceFlags,
              lapPercentage: lapPercentages[carIndex],
              trackLocation: trackSurfaces[carIndex],
            },
          };
        }

        return flagIndex;
      },
      {},
    );

    if (!isEmpty(updateIndex)) {
      this.emit(
        FlagsEvents.PaceFlagIndexChange,
        updateIndex,
        sessionTime,
        sessionTimeOfDay,
      );
    }
  };

  // private updateBlackFlags = (
  //   updateIndex: Record<string, FlagChangeEvent>,
  //   sessionTime: number,
  //   sessionTimeOfDay: number,
  // ) => {
  //   const updateEntries = Object.entries(updateIndex).filter(
  //     ([carIndex, { previousFlags, nextFlags }]) => {
  //       const [
  //         isPreviouslyDisqualified,
  //         isPreviouslyMeatballed,
  //         isPreviouslyServiceable,
  //         isPreviouslyWarned,
  //         isPreviouslyPenalized,
  //       ] = flagsHasFlags(previousFlags, ...BLACK_FLAGS);

  //       const [
  //         isDisqualified,
  //         isMeatballed,
  //         isServiceable,
  //         isWarned,
  //         isPenalized,
  //       ] = flagsHasFlags(nextFlags, ...BLACK_FLAGS);

  //       const isNewlyDisqualified = !isPreviouslyDisqualified && isDisqualified;
  //       const isNewlyMeatballed = !isPreviouslyMeatballed && isMeatballed;
  //       const isNewlyServiceable = !isPreviouslyServiceable && isServiceable;
  //       const isNewlyWarned = !isPreviouslyWarned && isWarned;
  //       const isNewlyPenalized = !isPreviouslyPenalized && isPenalized;

  //       const hasClearedDisqualification =
  //         isPreviouslyDisqualified && !isDisqualified;
  //       const hasClearedMeatball = isPreviouslyMeatballed && !isMeatballed;
  //       const hasClearedService = isPreviouslyServiceable && !isServiceable;
  //       const hasClearedWarning = isPreviouslyWarned && !isWarned;
  //       const hasClearedPenalty = isPreviouslyPenalized && !isPenalized;

  //       // We have a new black flag if we didn't previously have one and now we do
  //       const hasNewBlackFlag =
  //         isNewlyDisqualified ||
  //         isNewlyMeatballed ||
  //         isNewlyServiceable ||
  //         isNewlyWarned ||
  //         isNewlyPenalized;

  //       // We have cleared a black flag if we previously had one and now we don't
  //       const clearedBlackFlag =
  //         hasClearedDisqualification ||
  //         hasClearedMeatball ||
  //         hasClearedService ||
  //         hasClearedWarning ||
  //         hasClearedPenalty;

  //       return hasNewBlackFlag || clearedBlackFlag;
  //     },
  //   );
  // };
}

export default FlagsEmitter;
