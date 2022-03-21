/// <reference types="node" />
import { EventEmitter } from "events";
import { iRacingData } from "../types";
export declare enum iRacingSocketConnectionEvents {
    Connect = "connect",
    Disconnect = "disconnect",
    Error = "connectionError"
}
export declare enum iRacingClientConnectionEvents {
    Connect = "connect",
    Disconnect = "disconnect"
}
export declare enum iRacingSocketEvents {
    Update = "update"
}
export declare enum iRacingSocketCommands {
    CameraSwitchPosition = "cam_switch_pos",
    CameraSwitchNumber = "cam_switch_num",
    CameraSetState = "cam_set_state",
    ReplaySetPlaySpeed = "replay_set_play_speed",
    ReplaySetPlayPosition = "replay_set_play_position",
    ReplaySearch = "replay_search",
    ReplaySetState = "replay_set_state",
    ReloadAllTextures = "reload_all_textures",
    ReloadTexture = "reload_texture",
    ChatCommand = "chat_command",
    ChatCommandMacro = "chat_command_macro",
    PitCommand = "pit_command",
    TelemetryCommand = "telem_command",
    FFBCommand = "ffb_command",
    ReplaySearchSessionTime = "replay_search_session_time",
    VideoCapture = "video_capture"
}
export interface iRacingSocketOptions {
    requestParameters: string[];
    requestParametersOnce?: string[];
    fps?: number;
    server: string;
    readIBT?: boolean;
    reconnectTimeoutInterval?: number;
    autoconnect?: boolean;
}
export declare class iRacingSocket extends EventEmitter {
    private _socket;
    get socket(): WebSocket;
    set socket(socket: WebSocket);
    readonly server: string;
    private firstConnection;
    private reconnectTimeout;
    readonly requestParameters: string[];
    readonly requestParametersOnce: string[];
    readonly fps: number;
    readonly readIBT: boolean;
    readonly socketConnectionEmitter: EventEmitter;
    readonly iRacingConnectionEmitter: EventEmitter;
    private _data;
    get data(): iRacingData;
    reconnectTimeoutInterval: number;
    private _connecting;
    private _connected;
    get connected(): boolean;
    private set connected(value);
    constructor({ server, requestParameters, requestParametersOnce, fps: desiredFps, readIBT, reconnectTimeoutInterval, autoconnect, }: iRacingSocketOptions);
    open: () => void;
    close: () => void;
    scheduleRetry: (retryInterval?: number) => void;
    cancelRetry: () => void;
    sendCommand: (command: iRacingSocketCommands, ...args: any[]) => void;
    send: (payload: any) => void;
    removeAllListeners(event?: string | symbol): this;
    private onError;
    private onOpen;
    private onMessage;
    private onClose;
}
export default iRacingSocket;
//# sourceMappingURL=socket.d.ts.map