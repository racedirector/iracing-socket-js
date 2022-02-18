"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagsObserver = exports.FlagsObserverEvents = exports.IRACING_REQUEST_PARAMS = void 0;
const socketConsumer_1 = require("./socketConsumer");
exports.IRACING_REQUEST_PARAMS = ["SessionFlags", "SessionTime"];
var FlagsObserverEvents;
(function (FlagsObserverEvents) {
    FlagsObserverEvents["FlagChange"] = "flagChange";
})(FlagsObserverEvents = exports.FlagsObserverEvents || (exports.FlagsObserverEvents = {}));
class FlagsObserver extends socketConsumer_1.iRacingSocketConsumer {
    constructor() {
        super(...arguments);
        this.onUpdate = (keys) => {
            if (!keys.includes("SessionFlags")) {
                return;
            }
            const { SessionFlags: flags = -1, SessionTime: sessionTime, SessionTimeOfDay: sessionTimeOfDay, } = this.socket.data;
            if (flags !== this.previousFlags) {
                this.emit(FlagsObserverEvents.FlagChange, this.previousFlags, flags, sessionTime, sessionTimeOfDay);
                this.previousFlags = flags;
            }
        };
    }
}
exports.FlagsObserver = FlagsObserver;
exports.default = FlagsObserver;
