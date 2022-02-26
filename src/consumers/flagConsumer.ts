import { Flags } from "../types";
import { iRacingSocketConsumer } from "../core";

export const IRACING_REQUEST_PARAMS: string[] = [
  "SessionFlags",
  "SessionTime",
  "SessionTimeOfDay",
];

export enum FlagsConsumerEvents {
  FlagChange = "flagChange",
}

export class FlagsConsumer extends iRacingSocketConsumer {
  private _previousFlags: Flags;

  get flags(): Flags {
    return this._previousFlags;
  }

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
      this.emit(
        FlagsConsumerEvents.FlagChange,
        this._previousFlags,
        flags,
        sessionTime,
        sessionTimeOfDay,
      );

      this._previousFlags = flags as Flags;
    }
  };
}

export default FlagsConsumer;
