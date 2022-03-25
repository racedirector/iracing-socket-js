import { EventEmitter } from "events";
import { iRacingDataKey } from "../types";
import { iRacingSocket, iRacingSocketEvents } from "./socket";

/**
 * An `iRacingSocketConsumer` is an abstract class provided as a convenience
 * for users to easily seperate concerns associated with consuming data from
 * an iRacing socket. Given an `iRacingSocket` instance, a consumer binds
 * itself to the update event from the socket, invoking `onUpdate` on the
 * concrete implementation.
 *
 * Examples of concreate implemenations can be found in the "consumers" directory.
 *
 * @listens iRacingSocket.update
 */
export abstract class iRacingSocketConsumer extends EventEmitter {
  static requestParameters: iRacingDataKey[];
  static requestParametersOnce?: iRacingDataKey[];

  /**
   * The socket providing the data
   */
  protected socket: iRacingSocket;

  /**
   * A function that must be implemented by concrete implmentations that is
   * invoked when the socket data updates.
   * @param keys An array of keys that updated in the socket data.
   */
  abstract onUpdate(keys: iRacingDataKey[]): void;

  /**
   * Constructor that handles creating an `iRacingSocket`, if necessary, and
   * binds a listener to the update events.
   *
   * @param socket an `iRacingSocket` instance or options to create a this
   * managed socket.
   * @param prepend Whether or not to prepend the registered observer to the
   * front of the socket listeners, ensuring we get the "latest" updates.
   */
  constructor(socket: iRacingSocket) {
    super();

    this.socket = socket;
    this.bindUpdate();
  }

  protected bindUpdate = () => {
    const boundUpdate = (keys: iRacingDataKey[]) => this.onUpdate(keys);
    this.socket.on(iRacingSocketEvents.Update, boundUpdate);
  };
}

export default iRacingSocketConsumer;
