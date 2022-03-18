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
    sendCommand: (command: string, ...args: any[]) => void;
    send: (payload: any) => void;
    removeAllListeners(event?: string | symbol): this;
    private onError;
    private onOpen;
    private onMessage;
    private onClose;
}
export default iRacingSocket;
//# sourceMappingURL=socket.d.ts.map