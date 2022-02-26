import { EventEmitter } from "events";
import { iRacingData } from "../types";

const MAX_FPS = 60;
const MIN_FPS = 1;

export enum iRacingSocketConnectionEvents {
  Connect = "connect",
  Disconnect = "disconnect",
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
}

export class iRacingSocket extends EventEmitter {
  private socket: WebSocket;

  private server: string;

  private firstConnection: boolean;

  private reconnectTimeout: NodeJS.Timeout = null;

  readonly requestParameters: string[] = [];

  readonly requestParametersOnce: string[] = [];

  readonly fps: number;

  readonly readIBT: boolean;

  data: iRacingData = {};

  reconnectTimeoutInterval: number;

  connected: boolean;

  socketConnectionEmitter: EventEmitter = new EventEmitter();

  iRacingConnectionEmitter: EventEmitter = new EventEmitter();

  constructor(options: iRacingSocketOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();

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

  open = () => {
    this.socket = new WebSocket(`ws://${this.server}/ws`);
    this.socket.addEventListener("open", this.onOpen);
    this.socket.addEventListener("message", this.onMessage);
    this.socket.addEventListener("close", this.onClose);
  };

  close = () => {
    this.socket.close();
  };

  sendCommand = (command: string, ...args: any[]) => {
    this.send({
      command,
      args,
    });
  };

  send = (payload: any) => {
    this.socket.send(JSON.stringify(payload));
  };

  removeAllListeners(event?: string | symbol): this {
    this.iRacingConnectionEmitter.removeAllListeners();
    this.socketConnectionEmitter.removeAllListeners();
    return super.removeAllListeners(event);
  }

  private onOpen = () => {
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

  private onMessage = ({ data: eventData = "" }) => {
    // Normalize the JSON
    const normalizedEventData = eventData.replace(/\bNaN\b/g, "null");
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Object.entries(data).forEach(([key, value]) => {
        keys.push(key);
        this.data[key] = value;
      });
      this.emit(iRacingSocketEvents.Update, keys);
    }
  };

  private onClose = () => {
    this.socketConnectionEmitter.emit(iRacingSocketConnectionEvents.Disconnect);

    if (this.socket) {
      this.socket.removeEventListener("open", this.onOpen);
      this.socket.removeEventListener("message", this.onMessage);
      this.socket.removeEventListener("close", this.onClose);
    }

    if (this.connected) {
      this.connected = false;
      this.iRacingConnectionEmitter.emit(
        iRacingClientConnectionEvents.Disconnect,
      );
    }

    this.reconnectTimeout = setTimeout(() => {
      this.open();
    }, this.reconnectTimeoutInterval);
  };
}

export default iRacingSocket;
