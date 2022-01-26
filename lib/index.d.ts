export interface iRacingData {
    [key: string]: any;
}
export interface iRacingSocketOptions {
    requestParameters: string[];
    requestParametersOnce?: string[];
    fps?: number;
    server: string;
    readIBT?: boolean;
    reconnectTimeoutInterval?: number;
    onSocketConnect?: () => void;
    onSocketDisconnect?: () => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onUpdate?: (keys: string[]) => void;
}
export declare class iRacingSocket {
    private socket;
    private server;
    private firstConnection;
    private reconnectTimeout;
    readonly requestParameters: string[];
    readonly requestParametersOnce: string[];
    readonly fps: number;
    readonly readIBT: boolean;
    data: iRacingData;
    reconnectTimeoutInterval: number;
    connected: boolean;
    onSocketConnect: () => void;
    onSocketDisconnect: () => void;
    onConnect: () => void;
    onDisconnect: () => void;
    onUpdate: (keys: string[]) => void;
    constructor(options?: iRacingSocketOptions);
    open: () => void;
    close: () => void;
    sendCommand: (command: any, ...args: any[]) => void;
    send: (payload: any) => void;
    private onOpen;
    private onMessage;
    private onClose;
}
export default iRacingSocket;
