"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingSocket = exports.iRacingSocketEvents = exports.iRacingClientConnectionEvents = exports.iRacingSocketConnectionEvents = void 0;
const events_1 = require("events");
const MAX_FPS = 60;
const MIN_FPS = 1;
var iRacingSocketConnectionEvents;
(function (iRacingSocketConnectionEvents) {
    iRacingSocketConnectionEvents["Connect"] = "connect";
    iRacingSocketConnectionEvents["Disconnect"] = "disconnect";
})(iRacingSocketConnectionEvents = exports.iRacingSocketConnectionEvents || (exports.iRacingSocketConnectionEvents = {}));
var iRacingClientConnectionEvents;
(function (iRacingClientConnectionEvents) {
    iRacingClientConnectionEvents["Connect"] = "connect";
    iRacingClientConnectionEvents["Disconnect"] = "disconnect";
})(iRacingClientConnectionEvents = exports.iRacingClientConnectionEvents || (exports.iRacingClientConnectionEvents = {}));
var iRacingSocketEvents;
(function (iRacingSocketEvents) {
    iRacingSocketEvents["Update"] = "update";
})(iRacingSocketEvents = exports.iRacingSocketEvents || (exports.iRacingSocketEvents = {}));
class iRacingSocket extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.reconnectTimeout = null;
        this.requestParameters = [];
        this.requestParametersOnce = [];
        this.data = {};
        this.socketConnectionEmitter = new events_1.EventEmitter();
        this.iRacingConnectionEmitter = new events_1.EventEmitter();
        this.open = () => {
            this.socket = new WebSocket(`ws://${this.server}/ws`);
            this.socket.addEventListener("open", this.onOpen);
            this.socket.addEventListener("message", this.onMessage);
            this.socket.addEventListener("close", this.onClose);
        };
        this.close = () => {
            this.socket.close();
        };
        this.sendCommand = (command, ...args) => {
            this.send({
                command,
                args,
            });
        };
        this.send = (payload) => {
            this.socket.send(JSON.stringify(payload));
        };
        this.onOpen = () => {
            this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Connect);
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
            this.send({
                fps: this.fps,
                readIbt: this.readIBT,
                requestParams: this.requestParameters,
                requestParamsOnce: this.requestParametersOnce,
            });
        };
        this.onMessage = ({ data: eventData = "" }) => {
            const normalizedEventData = eventData.replace(/\bNaN\b/g, "null");
            const { data = {} } = JSON.parse(normalizedEventData);
            if (this.firstConnection && !this.connected) {
                this.firstConnection = false;
                this.connected = true;
                this.iRacingConnectionEmitter.emit(iRacingClientConnectionEvents.Connect);
            }
            if (data) {
                const keys = [];
                Object.entries(data).forEach(([key, value]) => {
                    keys.push(key);
                    this.data[key] = value;
                });
                this.emit(iRacingSocketEvents.Update, keys);
            }
        };
        this.onClose = () => {
            this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Disconnect);
            if (this.socket) {
                this.socket.removeEventListener("open", this.onOpen);
                this.socket.removeEventListener("message", this.onMessage);
                this.socket.removeEventListener("close", this.onClose);
            }
            if (this.connected) {
                this.connected = false;
                this.iRacingConnectionEmitter.emit(iRacingClientConnectionEvents.Disconnect);
            }
            this.reconnectTimeout = setTimeout(() => {
                this.open();
            }, this.reconnectTimeoutInterval);
        };
        this.server = options.server;
        this.requestParameters = options.requestParameters;
        this.requestParametersOnce = options.requestParametersOnce;
        this.fps = Math.min(Math.max(options.fps || 1, MIN_FPS), MAX_FPS);
        this.readIBT = options.readIBT || false;
        this.reconnectTimeoutInterval = options.reconnectTimeoutInterval || 2000;
        this.connected = false;
        this.firstConnection = true;
        this.open();
    }
    removeAllListeners(event) {
        this.iRacingConnectionEmitter.removeAllListeners();
        this.socketConnectionEmitter.removeAllListeners();
        return super.removeAllListeners(event);
    }
}
exports.iRacingSocket = iRacingSocket;
exports.default = iRacingSocket;
