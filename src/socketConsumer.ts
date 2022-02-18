import { EventEmitter } from "events";
import {
  iRacingSocket,
  iRacingSocketEvents,
  iRacingSocketOptions,
} from "./socket";

export abstract class iRacingSocketConsumer extends EventEmitter {
  protected socket: iRacingSocket;

  abstract onUpdate(keys: string[]): void;

  constructor(socket: iRacingSocket | iRacingSocketOptions) {
    super();

    this.socket =
      socket instanceof iRacingSocket ? socket : new iRacingSocket(socket);
    this.socket.on(iRacingSocketEvents.Update, (keys: string[]) =>
      this.onUpdate(keys),
    );
  }
}

export default iRacingSocketConsumer;
