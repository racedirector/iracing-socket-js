/// <reference types="node" />
import { EventEmitter } from "events";
import { iRacingSocket, iRacingSocketOptions } from "./socket";
export declare abstract class iRacingSocketConsumer extends EventEmitter {
    protected socket: iRacingSocket;
    abstract onUpdate(keys: string[]): void;
    constructor(socket: iRacingSocket | iRacingSocketOptions);
}
export default iRacingSocketConsumer;
