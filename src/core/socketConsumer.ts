import { EventEmitter } from "events";
import {
  iRacingSocket,
  iRacingSocketEvents,
  iRacingSocketOptions,
} from "./socket";

export abstract class iRacingSocketConsumer extends EventEmitter {
  protected socket: iRacingSocket;

  abstract onUpdate(keys: string[]): void;

  constructor(
    socket: iRacingSocket | iRacingSocketOptions,
    prepend: boolean = false,
  ) {
    super();

    this.socket =
      socket instanceof iRacingSocket ? socket : new iRacingSocket(socket);

    this.bindUpdate(prepend);
  }

  protected bindUpdate = (prepend: boolean = false) => {
    const boundUpdate = (keys: string[]) => this.onUpdate(keys);

    if (prepend) {
      this.socket.prependListener(iRacingSocketEvents.Update, boundUpdate);
    } else {
      this.socket.on(iRacingSocketEvents.Update, boundUpdate);
    }
  };
}

export default iRacingSocketConsumer;
