import { iRacingSocketConsumer } from "../core";
import { iRacingDataKey, PitServiceFlags, TrackLocation } from "../types";

export enum PitTimingEvents {
  // Event emitted when a car enters the pit lane
  PitEntry = "PitEntry",
  // Event emitted when a car exits the pit lane
  PitExit = "PitExit",
  // Event emitted when a car enters their pit box
  PitBoxEntry = "PitBoxEntry",
  // Event emitted when a car exits their pit box
  PitBoxExit = "PitBoxExit",
  // Event emitted when pit service starts
  PitServiceStart = "PitServiceStart",
  // Event emitted when pit service ends
  PitServiceEnd = "PitServiceEnd",
  // Event emitted when the `PitServiceStatus` value changes
  PitServiceStatus = "PitServiceStatus",
  // Event emitted when the requested pit service value changes
  PitServiceRequest = "PitServiceRequest",
  // Event emitted when the requested fuel value changes
  PitServiceFuelLevelRequest = "PitServiceFuelLevelRequest",
  // Event emitted when the requested tire pressures changes
  PitServiceTirePressureLevelRequest = "PitServiceTirePressureLevelRequest",
}

// TODO: FieldPitTimingConsumer that consumes the pit data for the field and makes
// it actionable
export class PitTimingConsumer extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = [
    "OnPitRoad",
    "PitstopActive",
    "PitSvFlags",
    "PitSvFuel",
    "PlayerCarPitSvStatus",
    "PlayerTrackSurface",
  ];

  protected trackLocation: TrackLocation = undefined;
  protected isOnPitRoad: boolean = undefined;
  protected isPitStopActive: boolean = undefined;

  private _serviceFlags: PitServiceFlags = 0x0;
  get serviceFlags(): PitServiceFlags {
    return this._serviceFlags;
  }

  private _fuelAmount: number = 0;
  get fuelAmount(): number {
    return this._fuelAmount;
  }

  onUpdate = (keys) => {
    const {
      OnPitRoad: currentOnPitRoad,
      PlayerTrackSurface: currentTrackLocation,
      PitstopActive: isPitStopActive,
      PitSvFlags: pitServiceFlags,
      PitSvFuel: pitServiceFuel,
      PlayerCarPitSvStatus: playerCarPitServiceStatus,
    } = this.socket.data;

    // If the player service status changes (error, service started, completed, etc)
    if (keys.includes("PlayerCarPitSvStatus")) {
      /**
       * Pit service status change event
       * @event PitTimingConsumer.pitServiceStatus
       * @param {PitServiceStatus} playerCarPitServiceStatus The pit service status
       * @param {Date} timestamp timestamp
       */
      this.emit(
        PitTimingEvents.PitServiceStatus,
        playerCarPitServiceStatus,
        new Date(),
      );
    }

    // If the pit service flags change and are different than the previous,
    // emit an event
    if (keys.includes("PitSvFlags") && this.serviceFlags !== pitServiceFlags) {
      /**
       * Pit service requested event
       * @event PitTimingConsumer.pitServiceRequested
       * @param {PitServiceFlags} pitServiceFlags The pit service requested
       */
      this.emit(PitTimingEvents.PitServiceRequest, pitServiceFlags);
      this._serviceFlags = pitServiceFlags;
    }

    // If the pit service fuel level request changes and is different than the previous,
    // emit an event
    if (keys.includes("PitSvFuel") && this.fuelAmount !== pitServiceFuel) {
      /**
       * Pit service fuel level requested event
       * @event PitTimingConsumer.pitServiceFuelLevelRequest
       * @param {PitServiceFlags} pitServiceFuel The fuel level requested
       */
      this.emit(PitTimingEvents.PitServiceFuelLevelRequest, pitServiceFuel);
      this._fuelAmount = pitServiceFuel;
    }

    // If the pit stop active changes, emit events based on the previous...
    if (keys.includes("PitstopActive")) {
      if (isPitStopActive && !this.isPitStopActive) {
        this.emit(
          PitTimingEvents.PitServiceStart,
          new Date(),
          pitServiceFlags,
          pitServiceFuel,
        );
      }

      if (!isPitStopActive && this.isPitStopActive) {
        this.emit(PitTimingEvents.PitServiceEnd, new Date());
      }
    }

    // TODO: What does towing look like?

    const previousStateExists =
      !!this.trackLocation && !!this.isOnPitRoad && !!this.isPitStopActive;

    // If the track location or the 'on pit road' status of a car has changed, state has changed.
    const stateChanged =
      currentTrackLocation !== this.trackLocation ||
      currentOnPitRoad !== this.isOnPitRoad;

    if (previousStateExists && stateChanged) {
      if (currentOnPitRoad && !this.isOnPitRoad) {
        // If the previous track location is approaching the pits, this is a legit pit entry
        if (this.trackLocation === TrackLocation.ApproachingPits) {
          this.emit(PitTimingEvents.PitEntry, new Date());
        }
      }

      // If we were approaching the pits and now we're in the pits, emit pit box entry
      if (
        currentTrackLocation === TrackLocation.InPitStall &&
        this.trackLocation === TrackLocation.ApproachingPits
      ) {
        this.emit(PitTimingEvents.PitBoxEntry, new Date());
      }

      // If we were in the stall and are now approaching pits, emit pit box exit
      if (
        currentTrackLocation === TrackLocation.ApproachingPits &&
        this.trackLocation === TrackLocation.InPitStall
      ) {
        this.emit(PitTimingEvents.PitBoxExit, new Date());
      }

      // If we were on pit road and we are no longer on pit road, emit pit exit
      if (!currentOnPitRoad && this.isOnPitRoad) {
        this.emit(PitTimingEvents.PitExit, new Date());
      }
    }

    this.trackLocation = currentTrackLocation;
    this.isOnPitRoad = currentOnPitRoad;
    this.isPitStopActive = isPitStopActive;
  };
}
