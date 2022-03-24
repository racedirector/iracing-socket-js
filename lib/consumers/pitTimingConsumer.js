"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitTimingConsumer = exports.PitTimingEvents = void 0;
const core_1 = require("../core");
const types_1 = require("../types");
var PitTimingEvents;
(function (PitTimingEvents) {
    PitTimingEvents["PitEntry"] = "PitEntry";
    PitTimingEvents["PitExit"] = "PitExit";
    PitTimingEvents["PitBoxEntry"] = "PitBoxEntry";
    PitTimingEvents["PitBoxExit"] = "PitBoxExit";
    PitTimingEvents["PitServiceStart"] = "PitServiceStart";
    PitTimingEvents["PitServiceEnd"] = "PitServiceEnd";
    PitTimingEvents["PitServiceStatus"] = "PitServiceStatus";
    PitTimingEvents["PitServiceRequest"] = "PitServiceRequest";
    PitTimingEvents["PitServiceFuelLevelRequest"] = "PitServiceFuelLevelRequest";
    PitTimingEvents["PitServiceTirePressureLevelRequest"] = "PitServiceTirePressureLevelRequest";
})(PitTimingEvents = exports.PitTimingEvents || (exports.PitTimingEvents = {}));
class PitTimingConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.trackLocation = undefined;
        this.isOnPitRoad = undefined;
        this.isPitStopActive = undefined;
        this._serviceFlags = 0x0;
        this._fuelAmount = 0;
        this.onUpdate = (keys) => {
            const { OnPitRoad: currentOnPitRoad, PlayerTrackSurface: currentTrackLocation, PitstopActive: isPitStopActive, PitSvFlags: pitServiceFlags, PitSvFuel: pitServiceFuel, PlayerCarPitSvStatus: playerCarPitServiceStatus, } = this.socket.data;
            if (keys.includes("PlayerCarPitSvStatus")) {
                this.emit(PitTimingEvents.PitServiceStatus, playerCarPitServiceStatus, new Date());
            }
            if (keys.includes("PitSvFlags") && this.serviceFlags !== pitServiceFlags) {
                this.emit(PitTimingEvents.PitServiceRequest, pitServiceFlags);
                this._serviceFlags = pitServiceFlags;
            }
            if (keys.includes("PitSvFuel") && this.fuelAmount !== pitServiceFuel) {
                this.emit(PitTimingEvents.PitServiceFuelLevelRequest, pitServiceFuel);
                this._fuelAmount = pitServiceFuel;
            }
            if (keys.includes("PitstopActive")) {
                if (isPitStopActive && !this.isPitStopActive) {
                    this.emit(PitTimingEvents.PitServiceStart, new Date(), pitServiceFlags, pitServiceFuel);
                }
                if (!isPitStopActive && this.isPitStopActive) {
                    this.emit(PitTimingEvents.PitServiceEnd, new Date());
                }
            }
            const previousStateExists = !!this.trackLocation && !!this.isOnPitRoad && !!this.isPitStopActive;
            const stateChanged = currentTrackLocation !== this.trackLocation ||
                currentOnPitRoad !== this.isOnPitRoad;
            if (previousStateExists && stateChanged) {
                if (currentOnPitRoad && !this.isOnPitRoad) {
                    if (this.trackLocation === types_1.TrackLocation.ApproachingPits) {
                        this.emit(PitTimingEvents.PitEntry, new Date());
                    }
                }
                if (currentTrackLocation === types_1.TrackLocation.InPitStall &&
                    this.trackLocation === types_1.TrackLocation.ApproachingPits) {
                    this.emit(PitTimingEvents.PitBoxEntry, new Date());
                }
                if (currentTrackLocation === types_1.TrackLocation.ApproachingPits &&
                    this.trackLocation === types_1.TrackLocation.InPitStall) {
                    this.emit(PitTimingEvents.PitBoxExit, new Date());
                }
                if (!currentOnPitRoad && this.isOnPitRoad) {
                    this.emit(PitTimingEvents.PitExit, new Date());
                }
            }
            this.trackLocation = currentTrackLocation;
            this.isOnPitRoad = currentOnPitRoad;
            this.isPitStopActive = isPitStopActive;
        };
    }
    get serviceFlags() {
        return this._serviceFlags;
    }
    get fuelAmount() {
        return this._fuelAmount;
    }
}
exports.PitTimingConsumer = PitTimingConsumer;
PitTimingConsumer.requestParameters = [
    "OnPitRoad",
    "PitstopActive",
    "PitSvFlags",
    "PitSvFuel",
    "PlayerCarPitSvStatus",
    "PlayerTrackSurface",
];
