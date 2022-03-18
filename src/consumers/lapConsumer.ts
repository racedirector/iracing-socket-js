import { iRacingSocketConsumer } from "../core";
import { iRacingDataKey, Flags } from "../types";
import { flagsHasFlags } from "../utilities";

export enum LapEvents {
  LapChange = "lapChange",
}

export class LapConsumer extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = ["RaceLaps", "SessionFlags"];

  private _currentLap: number = -1;

  get currentLap() {
    return this._currentLap;
  }

  private _flags: Flags = 0x0;

  get flags() {
    return this._flags;
  }

  private _greenLaps: number[] = [];

  get greenLaps() {
    return this._greenLaps;
  }

  private _cautionLaps: number[] = [];

  get cautionLaps() {
    return this._cautionLaps;
  }

  private _restartLaps: number[] = [];

  get restartLaps() {
    return this._restartLaps;
  }

  get isCaution() {
    return flagsHasFlags(this.flags, Flags.Caution, Flags.CautionWaving).reduce(
      (hasFlag, hasCurrentFlag) => hasCurrentFlag || hasFlag,
    );
  }

  /**
   * Track the current lap
   * @param currentLap The last completed lap number
   * @param isCaution Whether or not we're under caution
   * @fires LapConsumer.lapChange
   */
  private trackLaps = (currentLap: number, isCaution: boolean) => {
    if (currentLap !== this._currentLap) {
      const isGreenLap = this.greenLaps.includes(currentLap);
      const isCautionLap = this.cautionLaps.includes(currentLap);
      const isRestartLap = this.restartLaps.includes(currentLap);
      const isRestart = !isCaution && isCautionLap && currentLap > 1;

      if (!isGreenLap && !isCaution && !isCautionLap) {
        this.greenLaps.push(currentLap);
      } else if (isCaution && !isCautionLap) {
        this.cautionLaps.push(currentLap);
      }

      if (isRestart && !isRestartLap) {
        this.restartLaps.push(currentLap, currentLap + 1);
      }

      /**
       * Lap change event
       * @event LapConsumer.lapChange
       * @param {number} currentLap The last completed lap number
       * @param {number[]} greenLaps The tracked green laps
       * @param {number[]} cautionLaps The tracked caution laps
       * @param {number[]} restartLaps The tracked restart laps
       */
      this.emit(
        LapEvents.LapChange,
        currentLap,
        this.greenLaps,
        this.cautionLaps,
        this.restartLaps,
      );

      this._currentLap = currentLap;
    }
  };

  onUpdate = (keys: string[]): void => {
    const newData = { ...this.socket.data };
    if (keys.includes("SessionFlags")) {
      this._flags = newData.SessionFlags;
    }

    if (keys.includes("RaceLaps")) {
      this.trackLaps(newData.RaceLaps, this.isCaution);
    }
  };
}

export default LapConsumer;
