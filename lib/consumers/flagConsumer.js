"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagsConsumer = exports.FlagsConsumerEvents = exports.IRACING_REQUEST_PARAMS = void 0;
const core_1 = require("../core");
exports.IRACING_REQUEST_PARAMS = [
    "SessionFlags",
    "SessionTime",
    "SessionTimeOfDay",
];
var FlagsConsumerEvents;
(function (FlagsConsumerEvents) {
    FlagsConsumerEvents["FlagChange"] = "flagChange";
})(FlagsConsumerEvents = exports.FlagsConsumerEvents || (exports.FlagsConsumerEvents = {}));
class FlagsConsumer extends core_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.onUpdate = (keys) => {
            if (!keys.includes("SessionFlags")) {
                return;
            }
            const { SessionFlags: flags = -1, SessionTime: sessionTime, SessionTimeOfDay: sessionTimeOfDay, } = this.socket.data;
            if (flags !== this._previousFlags) {
                this.emit(FlagsConsumerEvents.FlagChange, this._previousFlags, flags, sessionTime, sessionTimeOfDay);
                this._previousFlags = flags;
            }
        };
    }
    get flags() {
        return this._previousFlags;
    }
}
exports.FlagsConsumer = FlagsConsumer;
exports.default = FlagsConsumer;
