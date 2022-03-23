"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagsConsumer = exports.FlagsEvents = void 0;
const types_1 = require("../types");
const core_1 = require("../core");
var FlagsEvents;
(function (FlagsEvents) {
    FlagsEvents["FlagChange"] = "flagChange";
})(FlagsEvents = exports.FlagsEvents || (exports.FlagsEvents = {}));
class FlagsConsumer extends core_1.iRacingSocketConsumer {
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
exports.FlagsConsumer = FlagsConsumer;
FlagsConsumer.requestParameters = [
    "SessionFlags",
    "SessionTime",
    "SessionTimeOfDay",
];
exports.default = types_1.Flags;
