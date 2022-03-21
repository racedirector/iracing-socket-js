"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimIncidentsConsumer = exports.FlagsEvents = void 0;
const core_1 = require("../core");
var FlagsEvents;
(function (FlagsEvents) {
    FlagsEvents["FlagChange"] = "flagChange";
})(FlagsEvents = exports.FlagsEvents || (exports.FlagsEvents = {}));
class SimIncidentsConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.onUpdate = (keys) => {
            if (!keys.includes("SessionFlags")) {
                return;
            }
            const { SessionFlags: flags = -1, SessionTime: sessionTime, SessionTimeOfDay: sessionTimeOfDay, } = this.socket.data;
            if (flags !== this._previousFlags) {
                this.emit(FlagsEvents.FlagChange, this._previousFlags, flags, sessionTime, sessionTimeOfDay);
                this._previousFlags = flags;
            }
        };
    }
    get flags() {
        return this._previousFlags;
    }
}
exports.SimIncidentsConsumer = SimIncidentsConsumer;
SimIncidentsConsumer.requestParameters = [
    "SessionFlags",
    "SessionTime",
    "SessionTimeOfDay",
];
exports.default = SimIncidentsConsumer;
