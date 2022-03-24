/// <reference types="node" />
import { EventEmitter } from "events";
import { iRacingDataKey } from "../types";
import { iRacingSocket } from "./socket";
export declare abstract class iRacingSocketConsumer extends EventEmitter {
    static requestParameters: iRacingDataKey[];
    static requestParametersOnce?: iRacingDataKey[];
    protected socket: iRacingSocket;
    abstract onUpdate(keys: iRacingDataKey[]): void;
    constructor(socket: iRacingSocket);
    protected bindUpdate: () => void;
}
export default iRacingSocketConsumer;
//# sourceMappingURL=socketConsumer.d.ts.map