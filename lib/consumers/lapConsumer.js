"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LapConsumer = exports.LapEvents = void 0;
const core_1 = require("../core");
const types_1 = require("../types");
const utilities_1 = require("../utilities");
var LapEvents;
(function (LapEvents) {
    LapEvents["LapChange"] = "lapChange";
})(LapEvents = exports.LapEvents || (exports.LapEvents = {}));
class LapConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this._currentLap = -1;
        this._flags = 0x0;
        this._greenLaps = [];
        this._cautionLaps = [];
        this._restartLaps = [];
        this.trackLaps = (currentLap, isCaution) => {
            if (currentLap !== this._currentLap) {
                const isGreenLap = this.greenLaps.includes(currentLap);
                const isCautionLap = this.cautionLaps.includes(currentLap);
                const isRestartLap = this.restartLaps.includes(currentLap);
                const isRestart = !isCaution && isCautionLap && currentLap > 1;
                if (!isGreenLap && !isCaution && !isCautionLap) {
                    this.greenLaps.push(currentLap);
                }
                else if (isCaution && !isCautionLap) {
                    this.cautionLaps.push(currentLap);
                }
                if (isRestart && !isRestartLap) {
                    this.restartLaps.push(currentLap, currentLap + 1);
                }
                this.emit(LapEvents.LapChange, currentLap, this.greenLaps, this.cautionLaps, this.restartLaps);
                this._currentLap = currentLap;
            }
        };
        this.onUpdate = (keys) => {
            const newData = Object.assign({}, this.socket.data);
            if (keys.includes("SessionFlags")) {
                this._flags = newData.SessionFlags;
            }
            if (keys.includes("RaceLaps")) {
                this.trackLaps(newData.RaceLaps, this.isCaution);
            }
        };
    }
    get currentLap() {
        return this._currentLap;
    }
    get flags() {
        return this._flags;
    }
    get greenLaps() {
        return this._greenLaps;
    }
    get cautionLaps() {
        return this._cautionLaps;
    }
    get restartLaps() {
        return this._restartLaps;
    }
    get isCaution() {
        return (0, utilities_1.flagsHasFlags)(this.flags, types_1.Flags.Caution, types_1.Flags.CautionWaving).reduce((hasFlag, hasCurrentFlag) => hasCurrentFlag || hasFlag);
    }
}
exports.LapConsumer = LapConsumer;
LapConsumer.requestParameters = ["RaceLaps", "SessionFlags"];
exports.default = LapConsumer;
