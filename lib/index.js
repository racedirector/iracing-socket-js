"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingSocket = void 0;
const MAX_FPS = 60;
const MIN_FPS = 1;
const noop = () => { };
class iRacingSocket {
    constructor(options) {
        this.reconnectTimeout = null;
        this.data = {};
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
            this.onSocketConnect();
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
                this.onConnect();
            }
            if (data) {
                const keys = [];
                Object.entries(data).forEach(([key, value]) => {
                    keys.push(key);
                    this.data[key] = value;
                });
                this.onUpdate(keys);
            }
        };
        this.onClose = () => {
            this.onSocketDisconnect();
            if (this.socket) {
                this.socket.removeEventListener("open", this.onOpen);
                this.socket.removeEventListener("message", this.onMessage);
                this.socket.removeEventListener("close", this.onClose);
            }
            if (this.connected) {
                this.connected = false;
                this.onDisconnect();
            }
            this.reconnectTimeout = setTimeout(() => {
                this.open();
            }, this.reconnectTimeoutInterval);
        };
        this.onSocketConnect = options.onSocketConnect || noop;
        this.onSocketDisconnect = options.onSocketDisconnect || noop;
        this.onConnect = options.onConnect || noop;
        this.onDisconnect = options.onDisconnect || noop;
        this.onUpdate = options.onUpdate || noop;
        this.server = options.server;
        this.requestParameters = options.requestParameters;
        this.fps = Math.min(Math.max(options.fps || 1, MIN_FPS), MAX_FPS);
        this.readIBT = options.readIBT || false;
        this.reconnectTimeoutInterval = options.reconnectTimeoutInterval || 2000;
        this.connected = false;
        this.firstConnection = true;
        this.open();
    }
}
exports.iRacingSocket = iRacingSocket;
exports.default = iRacingSocket;
