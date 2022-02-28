/// <reference types="node" />
import { EventEmitter } from "events";
import { iRacingSocket, iRacingSocketOptions } from "./socket";
export declare abstract class iRacingSocketConsumer extends EventEmitter {
    protected socket: iRacingSocket;
    abstract onUpdate(keys: string[]): void;
    constructor(socket: iRacingSocket | iRacingSocketOptions, prepend?: boolean);
    protected bindUpdate: (prepend?: boolean) => void;
}
export default iRacingSocketConsumer;
//# sourceMappingURL=socketConsumer.d.ts.map