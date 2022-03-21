import { Flags, iRacingDataKey } from "../types";
import { iRacingSocketConsumer } from "../core";

/**
 * All events that `FlagsConsumer` can emit.
 */
export enum FlagsEvents {
  FlagChange = "flagChange",
}

/**
 * A `FlagsConsumer` is a derived implementation of `iRacingSocketConsumer` to
 * emit timestamped events for `SessionFlags` changes.
 */
export class SimIncidentsConsumer extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = [
    "SessionFlags",
    "SessionTime",
    "SessionTimeOfDay",
  ];

  private _previousFlags: Flags;

  get flags(): Flags {
    return this._previousFlags;
  }

  /**
   * Handle update events
   * @param keys the changed keys
   * @fires FlagsConsumer.flagChange
   */
  onUpdate = (keys: string[]) => {
    if (!keys.includes("SessionFlags")) {
      return;
    }

    const {
      SessionFlags: flags = -1,
      SessionTime: sessionTime,
      SessionTimeOfDay: sessionTimeOfDay,
    } = this.socket.data;

    if (flags !== this._previousFlags) {
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
        flags,
        sessionTime,
        sessionTimeOfDay,
      );

      this._previousFlags = flags as Flags;
    }
  };
}

export default SimIncidentsConsumer;
