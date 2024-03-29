import { EventEmitter } from "events";
import invariant from "ts-invariant";
import { iRacingData, SocketCommandEventMap } from "../types";

const MAX_FPS = 60;
const MIN_FPS = 1;

const fps = (desiredFps: number): number =>
  Math.min(Math.max(desiredFps, MIN_FPS), MAX_FPS);

export enum iRacingSocketConnectionEvents {
  Connecting = "connecting",
  Connect = "connect",
  Disconnect = "disconnect",
  Error = "connectionError",
}

export enum iRacingClientConnectionEvents {
  Connect = "connect",
  Disconnect = "disconnect",
}

export enum iRacingSocketEvents {
  Update = "update",
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

export class iRacingSocket extends EventEmitter {
  private _socket: WebSocket;
  get socket(): WebSocket {
    return this._socket;
  }

  set socket(socket: WebSocket) {
    if (this._socket) {
      this._socket.removeEventListener("open", this.onOpen);
      this._socket.removeEventListener("message", this.onMessage);
      this._socket.removeEventListener("close", this.onClose);
      this._socket.removeEventListener("error", this.onError);
    }

    this._socket = socket;
  }

  readonly server: string;

  private firstConnection: boolean;

  private reconnectTimeout: NodeJS.Timeout = null;

  readonly requestParameters: string[] = [];

  readonly requestParametersOnce: string[] = [];

  readonly fps: number;

  readonly readIBT: boolean;

  readonly socketConnectionEmitter: EventEmitter = new EventEmitter();

  readonly iRacingConnectionEmitter: EventEmitter = new EventEmitter();

  private _data: iRacingData = {};
  get data(): iRacingData {
    return this._data;
  }

  reconnectTimeoutInterval: number;

  private _connecting: boolean;
  get connecting(): boolean {
    return this._connecting;
  }

  private set connecting(connecting: boolean) {
    this._connecting = connecting;
    this.emit(iRacingSocketConnectionEvents.Connecting, connecting);
  }

  private _connected: boolean;
  get connected(): boolean {
    return this._connected;
  }

  private set connected(isConnected: boolean) {
    if (this.connecting) {
      this.connecting = false;
    }

    this._connected = isConnected;
  }

  constructor({
    server,
    requestParameters = [],
    requestParametersOnce = [],
    fps: desiredFps = 1,
    readIBT = false,
    reconnectTimeoutInterval = 2000,
    autoconnect = true,
  }: iRacingSocketOptions) {
    super();

    invariant(
      requestParameters.length > 0 || requestParametersOnce.length > 0,
      "Request parameters must be provided and cannot be empty.",
    );

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

  open = () => {
    if (!this.connecting) {
      this.socket = new WebSocket(`ws://${this.server}/ws`);
      this.socket.addEventListener("open", this.onOpen);
      this.socket.addEventListener("message", this.onMessage);
      this.socket.addEventListener("close", this.onClose);
      this.socket.addEventListener("error", this.onError);
      this.connecting = true;
    }
  };

  close = () => this.socket.close();

  private scheduleRetry = (retryInterval?: number) => {
    this.reconnectTimeout = setTimeout(() => {
      this.open();
    }, retryInterval || this.reconnectTimeoutInterval);
  };

  private cancelRetry = () => {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
  };

  sendCommand = <C extends keyof SocketCommandEventMap>(
    command: C,
    args: SocketCommandEventMap[C],
  ) =>
    this.send({
      command,
      args,
    });

  send = (payload: any) => this.socket.send(JSON.stringify(payload));

  removeAllListeners(event?: string | symbol): this {
    this.iRacingConnectionEmitter.removeAllListeners();
    this.socketConnectionEmitter.removeAllListeners();

    return super.removeAllListeners(event);
  }

  private onError = (event: any) => {
    const connectionError = !this.connected && this.connecting;
    if (connectionError) {
      this.socketConnectionEmitter.emit(
        iRacingSocketConnectionEvents.Error,
        event,
      );

      this.scheduleRetry();
    }
  };

  private onOpen = () => {
    this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Connect);

    this.cancelRetry();

    this.send({
      fps: this.fps,
      readIbt: this.readIBT,
      requestParams: this.requestParameters,
      requestParamsOnce: this.requestParametersOnce,
    });
  };

  private onMessage = ({ data: eventData }: any) => {
    // Normalize the JSON
    const normalizedEventData = eventData
      .toString()
      .replace(/\bNaN\b/g, "null");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data = {} } = JSON.parse(normalizedEventData);
    // TOOD: Lifecycle?

    // On first time connection...
    if (this.firstConnection && !this.connected) {
      this.firstConnection = false;
      this.connected = true;
      this.iRacingConnectionEmitter.emit(iRacingClientConnectionEvents.Connect);
    }

    // Update data
    if (data) {
      const keys: string[] = [];
      Object.entries(data).forEach(([key, value]) => {
        keys.push(key);
        this._data[key] = value;
      });
      this.emit(iRacingSocketEvents.Update, keys);
    }
  };

  private onClose = () => {
    this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Disconnect);

    this.socket = null;

    if (this.connected) {
      this.connected = false;
      this.iRacingConnectionEmitter.emit(
        iRacingClientConnectionEvents.Disconnect,
      );
    }

    this.scheduleRetry();
  };
}

export default iRacingSocket;
