import {
  iRacingSocket,
  iRacingSocketConsumer,
  iRacingSocketOptions,
} from "../core";
import { PitServiceStatus, TrackLocation } from "../types";

export const IRACING_REQUEST_PARAMS = [
  "CarIdxOnPitRoad",
  "CarIdxTrackSurface",
  "DriverInfo",
  "PitStopActive",
  "PitSvFlags",
  "PitSvFuel",
  "PlayerCarPitSvStatus",
];

export const IRACING_REQUEST_PARAMS_ONCE = [];

export enum PitTimingEvents {
  PitEntry = "PitEntry",
  PitExit = "PitExit",
  PitBoxEntry = "PitBoxEntry",
  PitBoxExit = "PitBoxExit",
  PitServiceStart = "PitServiceStart",
  PitServiceEnd = "PitServiceEnd",
  PitServiceError = "PitServiceError",
}

export interface PitTimingConsumerOptions {
  socket: iRacingSocket | iRacingSocketOptions;
}

export class PitTimingConsumer extends iRacingSocketConsumer {
  protected trackLocation: TrackLocation = undefined;
  protected isOnPitRoad: boolean = undefined;
  protected isPitStopActive: boolean = undefined;

  onUpdate = (keys) => {
    const {
      CarIdxOnPitRoad: carIdxOnPitRoad = [],
      CarIdxTrackSurface: carIdxTrackSurface = [],
      DriverInfo: { DriverCarIdx: driverCarIdx = -1 },
      PitStopActive: isPitStopActive,
      PitSvFlags: pitServiceFlags,
      PitSvFuel: pitServiceFuel,
      PlayerCarPitSvStatus: playerCarPitServiceStatus,
    } = this.socket.data;

    const currentTrackLocation = carIdxTrackSurface[driverCarIdx];
    const currentOnPitRoad = carIdxOnPitRoad[driverCarIdx];

    const previousStateExists =
      typeof this.trackLocation !== "undefined" &&
      typeof this.isOnPitRoad !== "undefined" &&
      typeof this.isPitStopActive !== "undefined";

    const stateChanged =
      currentTrackLocation !== this.trackLocation ||
      currentOnPitRoad !== this.isOnPitRoad;

    if (previousStateExists && stateChanged) {
      if (currentOnPitRoad && !this.isOnPitRoad) {
        // If the previous track location is approaching the pits, this is a legit pit entry
        if (this.trackLocation === TrackLocation.ApproachingPits) {
          this.emit(PitTimingEvents.PitEntry, driverCarIdx, new Date());
        }
      }

      if (
        currentTrackLocation === TrackLocation.InPitStall &&
        this.trackLocation === TrackLocation.ApproachingPits
      ) {
        this.emit(PitTimingEvents.PitBoxEntry, driverCarIdx, new Date());
      }

      if (
        currentTrackLocation === TrackLocation.ApproachingPits &&
        this.trackLocation === TrackLocation.InPitStall
      ) {
        this.emit(PitTimingEvents.PitBoxExit, driverCarIdx, new Date());
      }

      if (!currentOnPitRoad && this.isOnPitRoad) {
        this.emit(PitTimingEvents.PitExit, driverCarIdx, new Date());
      }

      if (isPitStopActive && !this.isPitStopActive) {
        this.emit(
          PitTimingEvents.PitServiceStart,
          driverCarIdx,
          new Date(),
          pitServiceFlags,
          pitServiceFuel,
        );
      }

      if (!isPitStopActive && this.isPitStopActive) {
        this.emit(PitTimingEvents.PitServiceEnd, driverCarIdx, new Date());
      }
    }

    if (keys.includes("PlayerCarPitSvStatus")) {
      if (playerCarPitServiceStatus >= PitServiceStatus.TooFarLeft) {
        this.emit(PitTimingEvents.PitServiceError, playerCarPitServiceStatus);
      }
    }

    this.trackLocation = currentTrackLocation;
    this.isOnPitRoad = currentOnPitRoad;
    this.isPitStopActive = isPitStopActive;
  };
}
