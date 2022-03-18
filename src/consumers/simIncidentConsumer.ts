import { iRacingSocket, iRacingSocketConsumer } from "../core";
import { iRacingDataKey, Driver, Flags } from "../types";
import { chain, isEmpty } from "lodash";

export type DriverIncidentFragment = Pick<
  Driver,
  "UserID" | "CurDriverIncidentCount"
>;

export interface DriverSimIncidentEvent {
  // The value of incidents detected from the sim
  value: number;
  // The weight of the incidents, computed by the config
  weight: number;
  // Session number
  sessionNumber: number;
  // The number of seconds since the session started
  sessionTime: number;
  // The number of seconds representing the in-sim date
  sessionTimeOfDay: number;
  // The flags displayed at detection
  sessionFlags: Flags;
  // Car location on track, percentage
  lapPercentage: number;
  // Driver ID
  driverId: number;
  // Car index
  carIndex: string;
}

export interface SimIncidentIndex {
  [carIndex: string]: DriverSimIncidentEvent;
}

export enum SimIncidentEvents {
  SimIncidents = "simIncidents",
}

export interface SimIncidentConsumerConfig {
  maxSimIncidentWeight: number;
}

export const DEFAULT_CONFIG: SimIncidentConsumerConfig = {
  maxSimIncidentWeight: 2,
};

export interface SimIncidentConsumerOptions {
  socket: iRacingSocket;
  config?: SimIncidentConsumerConfig;
}

export class SimIncidentConsumer extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = [
    "DriverInfo",
    "CarIdxLapDistPct",
    "SessionTimeOfDay",
    "SessionTime",
    "SessionFlags",
    "SessionNum",
  ];

  private driverIndex: Record<number, Driver>;

  private _config: SimIncidentConsumerConfig;

  public get config(): SimIncidentConsumerConfig {
    return this._config;
  }

  public set config(config: Partial<SimIncidentConsumerConfig>) {
    this._config = {
      ...this._config,
      ...config,
    };
  }

  constructor({ socket, config = DEFAULT_CONFIG }: SimIncidentConsumerOptions) {
    super(socket);
    this.config = config;
  }

  onUpdate = (keys: string[]): void => {
    // Only run if there's an update to DriverInfo because that's where the incident
    // count data comes from...
    if (!keys.includes("DriverInfo")) {
      return;
    }

    const nextData = { ...this.socket.data };
    // !!!: Don't include the pace car
    const nextIndex = chain(nextData.DriverInfo?.Drivers || [])
      .filter(({ CarIsPaceCar }) => !CarIsPaceCar)
      .keyBy("CarIdx")
      .value();

    if (this.driverIndex) {
      const incidents: SimIncidentIndex = Object.entries(nextIndex).reduce(
        (incidentIndex, [carIndex, driver]) => {
          const existingDriver = this.driverIndex?.[carIndex] || undefined;
          if (existingDriver && existingDriver.UserID === driver.UserID) {
            const incidentCount =
              driver.CurDriverIncidentCount -
              existingDriver.CurDriverIncidentCount;

            if (incidentCount > 0) {
              return {
                ...incidentIndex,
                [carIndex]: {
                  carIndex,
                  value: incidentCount,
                  weight: this.weightForIncidentValue(incidentCount),
                  sessionNumber: nextData.SessionNum || -1,
                  sessionTime: nextData.SessionTime || -1,
                  sessionTimeOfDay: nextData.SessionTimeOfDay || -1,
                  sessionFlags: nextData.SessionFlags || 0x0,
                  lapPercentage: nextData.CarIdxLapDistPct[carIndex],
                  driverId: driver.UserID,
                },
              };
            }
          }

          return incidentIndex;
        },
        {} as SimIncidentIndex,
      );

      if (!isEmpty(incidents)) {
        this.emit(SimIncidentEvents.SimIncidents, incidents);
      }
    }

    this.driverIndex = nextIndex;
  };

  private weightForIncidentValue = (incidentValue: number): number => {
    return Math.min(incidentValue, this.config.maxSimIncidentWeight);
  };
}

export default SimIncidentConsumer;
