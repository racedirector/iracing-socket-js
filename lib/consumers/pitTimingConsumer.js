"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PitTimingConsumer = exports.PitTimingEvents = exports.IRACING_REQUEST_PARAMS_ONCE = exports.IRACING_REQUEST_PARAMS = void 0;
const core_1 = require("../core");
const types_1 = require("../types");
exports.IRACING_REQUEST_PARAMS = [
    "CarIdxOnPitRoad",
    "CarIdxTrackSurface",
    "DriverInfo",
    "PitStopActive",
    "PitSvFlags",
    "PitSvFuel",
    "PlayerCarPitSvStatus",
];
exports.IRACING_REQUEST_PARAMS_ONCE = [];
var PitTimingEvents;
(function (PitTimingEvents) {
    PitTimingEvents["PitEntry"] = "PitEntry";
    PitTimingEvents["PitExit"] = "PitExit";
    PitTimingEvents["PitBoxEntry"] = "PitBoxEntry";
    PitTimingEvents["PitBoxExit"] = "PitBoxExit";
    PitTimingEvents["PitServiceStart"] = "PitServiceStart";
    PitTimingEvents["PitServiceEnd"] = "PitServiceEnd";
    PitTimingEvents["PitServiceError"] = "PitServiceError";
})(PitTimingEvents = exports.PitTimingEvents || (exports.PitTimingEvents = {}));
class PitTimingConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.trackLocation = undefined;
        this.isOnPitRoad = undefined;
        this.isPitStopActive = undefined;
        this.onUpdate = (keys) => {
            const { CarIdxOnPitRoad: carIdxOnPitRoad = [], CarIdxTrackSurface: carIdxTrackSurface = [], DriverInfo: { DriverCarIdx: driverCarIdx = -1 }, PitStopActive: isPitStopActive, PitSvFlags: pitServiceFlags, PitSvFuel: pitServiceFuel, PlayerCarPitSvStatus: playerCarPitServiceStatus, } = this.socket.data;
            const currentTrackLocation = carIdxTrackSurface[driverCarIdx];
            const currentOnPitRoad = carIdxOnPitRoad[driverCarIdx];
            const previousStateExists = typeof this.trackLocation !== "undefined" &&
                typeof this.isOnPitRoad !== "undefined" &&
                typeof this.isPitStopActive !== "undefined";
            const stateChanged = currentTrackLocation !== this.trackLocation ||
                currentOnPitRoad !== this.isOnPitRoad;
            if (previousStateExists && stateChanged) {
                if (currentOnPitRoad && !this.isOnPitRoad) {
                    if (this.trackLocation === types_1.TrackLocation.ApproachingPits) {
                        this.emit(PitTimingEvents.PitEntry, driverCarIdx, new Date());
                    }
                }
                if (currentTrackLocation === types_1.TrackLocation.InPitStall &&
                    this.trackLocation === types_1.TrackLocation.ApproachingPits) {
                    this.emit(PitTimingEvents.PitBoxEntry, driverCarIdx, new Date());
                }
                if (currentTrackLocation === types_1.TrackLocation.ApproachingPits &&
                    this.trackLocation === types_1.TrackLocation.InPitStall) {
                    this.emit(PitTimingEvents.PitBoxExit, driverCarIdx, new Date());
                }
                if (!currentOnPitRoad && this.isOnPitRoad) {
                    this.emit(PitTimingEvents.PitExit, driverCarIdx, new Date());
                }
                if (isPitStopActive && !this.isPitStopActive) {
                    this.emit(PitTimingEvents.PitServiceStart, driverCarIdx, new Date(), pitServiceFlags, pitServiceFuel);
                }
                if (!isPitStopActive && this.isPitStopActive) {
                    this.emit(PitTimingEvents.PitServiceEnd, driverCarIdx, new Date());
                }
            }
            if (keys.includes("PlayerCarPitSvStatus")) {
                if (playerCarPitServiceStatus >= types_1.PitServiceStatus.TooFarLeft) {
                    this.emit(PitTimingEvents.PitServiceError, playerCarPitServiceStatus);
                }
            }
            this.trackLocation = currentTrackLocation;
            this.isOnPitRoad = currentOnPitRoad;
            this.isPitStopActive = isPitStopActive;
        };
    }
}
exports.PitTimingConsumer = PitTimingConsumer;