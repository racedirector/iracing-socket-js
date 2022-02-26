"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingSocketConsumer = void 0;
const events_1 = require("events");
const socket_1 = require("./socket");
class iRacingSocketConsumer extends events_1.EventEmitter {
    constructor(socket, prepend = false) {
        super();
        this.bindUpdate = (prepend = false) => {
            const boundUpdate = (keys) => this.onUpdate(keys);
            if (prepend) {
                this.socket.prependListener(socket_1.iRacingSocketEvents.Update, boundUpdate);
            }
            else {
                this.socket.on(socket_1.iRacingSocketEvents.Update, boundUpdate);
            }
        };
        this.socket =
            socket instanceof socket_1.iRacingSocket ? socket : new socket_1.iRacingSocket(socket);
        this.bindUpdate(prepend);
    }
}
exports.iRacingSocketConsumer = iRacingSocketConsumer;
exports.default = iRacingSocketConsumer;
