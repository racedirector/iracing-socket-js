const MAX_FPS = 60;
const MIN_FPS = 1;

const noop = () => {};

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

export class iRacingSocket {
  private socket: WebSocket;

  private server: string;

  private firstConnection: boolean;

  private reconnectTimeout: NodeJS.Timeout = null;

  readonly requestParameters: string[];

  readonly requestParametersOnce: string[];

  readonly fps: number;

  readonly readIBT: boolean;

  data: Record<string, any> = {
    data: {},
  };

  reconnectTimeoutInterval: number;

  connected: boolean;

  onSocketConnect: () => void;

  onSocketDisconnect: () => void;

  onConnect: () => void;

  onDisconnect: () => void;

  onUpdate: (keys: string[]) => void;

  constructor(options?: iRacingSocketOptions) {
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

  open = () => {
    this.socket = new WebSocket(`ws://${this.server}/ws`);

    this.socket.addEventListener("open", this.onOpen);
    this.socket.addEventListener("message", this.onMessage);
    this.socket.addEventListener("close", this.onClose);
  };

  close = () => {
    this.socket.close();
  };

  sendCommand = (command, ...args) => {
    this.send({
      command,
      args,
    });
  };

  send = (payload) => {
    this.socket.send(JSON.stringify(payload));
  };

  private onOpen = () => {
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

  private onMessage = ({ data: eventData = "" }) => {
    // Normalize the JSON
    const data = JSON.parse(eventData.replace(/\bNaN\b/g, "null"));
    // TOOD: Lifecycle?

    // On first time connection...
    if (this.firstConnection && !this.connected) {
      this.firstConnection = false;
      this.connected = true;
      this.onConnect();
    }

    // Update data
    if (data.data) {
      const keys: string[] = [];
      Object.entries(data.data).forEach(([key, value]) => {
        keys.push(key);
        this.data[key] = value;
      });
      this.onUpdate(keys);
    }
  };

  private onClose = () => {
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
}

export default iRacingSocket;
