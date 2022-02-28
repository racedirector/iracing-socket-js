/// <reference types="node" />
import { EventEmitter } from "events";
import { iRacingData } from "../types";
export declare enum iRacingSocketConnectionEvents {
    Connect = "connect",
    Disconnect = "disconnect"
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
}
export declare class iRacingSocket extends EventEmitter {
    private socket;
    readonly server: string;
    private firstConnection;
    private reconnectTimeout;
    readonly requestParameters: string[];
    readonly requestParametersOnce: string[];
    readonly fps: number;
    readonly readIBT: boolean;
    data: iRacingData;
    reconnectTimeoutInterval: number;
    connected: boolean;
    socketConnectionEmitter: EventEmitter;
    iRacingConnectionEmitter: EventEmitter;
    constructor(options: iRacingSocketOptions);
    open: () => void;
    close: () => void;
    sendCommand: (command: string, ...args: any[]) => void;
    send: (payload: any) => void;
    removeAllListeners(event?: string | symbol): this;
    private onOpen;
    private onMessage;
    private onClose;
}
export default iRacingSocket;
//# sourceMappingURL=socket.d.ts.map