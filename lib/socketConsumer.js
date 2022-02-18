"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingSocketConsumer = void 0;
const events_1 = require("events");
const socket_1 = require("./socket");
class iRacingSocketConsumer extends events_1.EventEmitter {
    constructor(socket) {
        super();
        this.socket =
            socket instanceof socket_1.iRacingSocket ? socket : new socket_1.iRacingSocket(socket);
        this.socket.on(socket_1.iRacingSocketEvents.Update, (keys) => this.onUpdate(keys));
    }
}
exports.iRacingSocketConsumer = iRacingSocketConsumer;
exports.default = iRacingSocketConsumer;
