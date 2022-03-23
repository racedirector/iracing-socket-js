import { iRacingSocket, iRacingSocketConsumer } from "../core";
import { iRacingDataKey, Driver, Flags } from "../types";
export interface SimIncidentEvent {
    value: number;
    weight: number;
    sessionNumber: number;
    sessionTime: number;
    sessionTimeOfDay: number;
    sessionFlags: Flags;
    lapPercentage: number;
    driverId: number;
    carIndex: string;
}
export interface SimIncidentIndex {
    [carIndex: string]: SimIncidentEvent;
}
export declare enum SimIncidentEvents {
    SimIncidents = "simIncidents"
}
export interface SimIncidentConsumerConfig {
    maxSimIncidentWeight: number;
}
export declare const DEFAULT_CONFIG: SimIncidentConsumerConfig;
export interface SimIncidentConsumerOptions {
    socket: iRacingSocket;
    config?: SimIncidentConsumerConfig;
}
export declare class SimIncidentConsumer extends iRacingSocketConsumer {
    static requestParameters: iRacingDataKey[];
    private _driverIndex;
    get driverIndex(): Record<string, Driver>;
    private _config;
    get config(): SimIncidentConsumerConfig;
    set config(config: Partial<SimIncidentConsumerConfig>);
    constructor({ socket, config }: SimIncidentConsumerOptions);
    onUpdate: (keys: string[]) => void;
    private weightForIncidentValue;
}
export default SimIncidentConsumer;
//# sourceMappingURL=simIncidentConsumer.d.ts.map