"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iRacingSocket = exports._iRacingSocketCommands = exports.iRacingSocketCommands = exports.iRacingSocketEvents = exports.iRacingClientConnectionEvents = exports.iRacingSocketConnectionEvents = void 0;
const events_1 = require("events");
const ts_invariant_1 = __importDefault(require("ts-invariant"));
const MAX_FPS = 60;
const MIN_FPS = 1;
const fps = (desiredFps) => Math.min(Math.max(desiredFps, MIN_FPS), MAX_FPS);
var iRacingSocketConnectionEvents;
(function (iRacingSocketConnectionEvents) {
    iRacingSocketConnectionEvents["Connect"] = "connect";
    iRacingSocketConnectionEvents["Disconnect"] = "disconnect";
    iRacingSocketConnectionEvents["Error"] = "connectionError";
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
var iRacingSocketCommands;
(function (iRacingSocketCommands) {
    iRacingSocketCommands["CameraSwitchPosition"] = "cam_switch_pos";
    iRacingSocketCommands["CameraSwitchNumber"] = "cam_switch_num";
    iRacingSocketCommands["CameraSetState"] = "cam_set_state";
    iRacingSocketCommands["ReplaySetPlaySpeed"] = "replay_set_play_speed";
    iRacingSocketCommands["ReplaySetPlayPosition"] = "replay_set_play_position";
    iRacingSocketCommands["ReplaySearch"] = "replay_search";
    iRacingSocketCommands["ReplaySetState"] = "replay_set_state";
    iRacingSocketCommands["ReloadAllTextures"] = "reload_all_textures";
    iRacingSocketCommands["ReloadTexture"] = "reload_texture";
    iRacingSocketCommands["ChatCommand"] = "chat_command";
    iRacingSocketCommands["ChatCommandMacro"] = "chat_command_macro";
    iRacingSocketCommands["PitCommand"] = "pit_command";
    iRacingSocketCommands["TelemetryCommand"] = "telem_command";
    iRacingSocketCommands["FFBCommand"] = "ffb_command";
    iRacingSocketCommands["ReplaySearchSessionTime"] = "replay_search_session_time";
    iRacingSocketCommands["VideoCapture"] = "video_capture";
})(iRacingSocketCommands = exports.iRacingSocketCommands || (exports.iRacingSocketCommands = {}));
var _iRacingSocketCommands;
(function (_iRacingSocketCommands) {
    _iRacingSocketCommands[_iRacingSocketCommands["CameraSwitchPosition"] = 0] = "CameraSwitchPosition";
})(_iRacingSocketCommands = exports._iRacingSocketCommands || (exports._iRacingSocketCommands = {}));
class iRacingSocket extends events_1.EventEmitter {
    constructor({ server, requestParameters, requestParametersOnce, fps: desiredFps = 1, readIBT = false, reconnectTimeoutInterval = 2000, autoconnect = true, }) {
        super();
        this.reconnectTimeout = null;
        this.requestParameters = [];
        this.requestParametersOnce = [];
        this.socketConnectionEmitter = new events_1.EventEmitter();
        this.iRacingConnectionEmitter = new events_1.EventEmitter();
        this._data = {};
        this.open = () => {
            if (!this._connecting) {
                this.socket = new WebSocket(`ws://${this.server}/ws`);
                this.socket.addEventListener("open", this.onOpen);
                this.socket.addEventListener("message", this.onMessage);
                this.socket.addEventListener("close", this.onClose);
                this.socket.addEventListener("error", this.onError);
                this._connecting = true;
            }
        };
        this.close = () => this.socket.close();
        this.scheduleRetry = (retryInterval) => {
            this.reconnectTimeout = setTimeout(() => {
                this.open();
            }, retryInterval || this.reconnectTimeoutInterval);
        };
        this.cancelRetry = () => {
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
        };
        this.sendCommand = (command, ...args) => this.send({
            command,
            args,
        });
        this.send = (payload) => this.socket.send(JSON.stringify(payload));
        this.onError = (event) => {
            const connectionError = !this.connected && this._connecting;
            if (connectionError) {
                this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Error, event);
                this.scheduleRetry();
            }
        };
        this.onOpen = () => {
            this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Connect);
            this.cancelRetry();
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
                    this._data[key] = value;
                });
                this.emit(iRacingSocketEvents.Update, keys);
            }
        };
        this.onClose = () => {
            this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Disconnect);
            this.socket = null;
            if (this.connected) {
                this.connected = false;
                this.iRacingConnectionEmitter.emit(iRacingClientConnectionEvents.Disconnect);
            }
            this.scheduleRetry();
        };
        (0, ts_invariant_1.default)(requestParameters.length > 0 || requestParametersOnce.length > 0, "Request parameters must be provided and cannot be empty.");
        this.server = server;
        this.requestParameters = requestParameters;
        this.requestParametersOnce = requestParametersOnce;
        this.fps = fps(desiredFps);
        this.readIBT = readIBT;
        this.reconnectTimeoutInterval = reconnectTimeoutInterval;
        this.connected = false;
        this.firstConnection = true;
        if (autoconnect) {
            this.open();
        }
    }
    get socket() {
        return this._socket;
    }
    set socket(socket) {
        if (this._socket) {
            this._socket.removeEventListener("open", this.onOpen);
            this._socket.removeEventListener("message", this.onMessage);
            this._socket.removeEventListener("close", this.onClose);
            this._socket.removeEventListener("error", this.onError);
        }
        this._socket = socket;
    }
    get data() {
        return this._data;
    }
    get connected() {
        return this._connected;
    }
    set connected(isConnected) {
        if (this._connecting) {
            this._connecting = false;
        }
        this._connected = isConnected;
    }
    removeAllListeners(event) {
        this.iRacingConnectionEmitter.removeAllListeners();
        this.socketConnectionEmitter.removeAllListeners();
        return super.removeAllListeners(event);
    }
}
exports.iRacingSocket = iRacingSocket;
exports.default = iRacingSocket;
