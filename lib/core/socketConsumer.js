"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingSocketConsumer = void 0;
const events_1 = require("events");
const socket_1 = require("./socket");
class iRacingSocketConsumer extends events_1.EventEmitter {
    constructor(socket) {
        super();
        this.bindUpdate = () => {
            const boundUpdate = (keys) => this.onUpdate(keys);
            this.socket.on(socket_1.iRacingSocketEvents.Update, boundUpdate);
        };
        this.socket = socket;
        this.bindUpdate();
    }
}
exports.iRacingSocketConsumer = iRacingSocketConsumer;
exports.default = iRacingSocketConsumer;
