import {
  iRacingSocket,
  iRacingSocketConsumer,
  iRacingDataKey,
  Driver,
  Flags,
  iRacingData,
} from "@racedirector/iracing-socket-js";
import { chain, isEmpty } from "lodash";

export interface SimIncidentEvent {
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
  [carIndex: string]: SimIncidentEvent;
}

export enum SimIncidentEvents {
  SimIncidents = "simIncidents",
}

export interface SimIncidentEmitterConfig {
  maxSimIncidentWeight: number;
}

export const DEFAULT_CONFIG: SimIncidentEmitterConfig = {
  maxSimIncidentWeight: 2,
};

export const incidentsForDriverIndexUpdate = (
  previousIndex: Record<string, Driver>,
  nextIndex: Record<string, Driver>,
  data: iRacingData,
  weightForIncidentValue: (value: number) => number,
) => {
  return Object.entries(nextIndex).reduce(
    (incidentIndex, [carIndex, driver]) => {
      const existingDriver = previousIndex?.[carIndex] || undefined;

      // Check for incidents for the existing driver
      if (existingDriver && existingDriver.UserID === driver.UserID) {
        const incidentCount =
          driver.CurDriverIncidentCount - existingDriver.CurDriverIncidentCount;

        if (incidentCount > 0) {
          return {
            ...incidentIndex,
            [carIndex]: {
              carIndex,
              value: incidentCount,
              weight: weightForIncidentValue(incidentCount),
              sessionFlags: data.CarIdxSessionFlags[carIndex] || 0x0,
              lapPercentage: data.CarIdxLapDistPct[carIndex],
              sessionNumber: data.SessionNum || -1,
              sessionTime: data.SessionTime || -1,
              sessionTimeOfDay: data.SessionTimeOfDay || -1,
              driverId: driver.UserID,
            },
          };
        }
      }

      // TODO: Check for new meatballs and DQs

      return incidentIndex;
    },
    {},
  );
};

export interface SimIncidentEmitterOptions {
  socket: iRacingSocket;
  config?: SimIncidentEmitterConfig;
}

export class SimIncidentEmitter extends iRacingSocketConsumer {
  static requestParameters: iRacingDataKey[] = [
    "DriverInfo",
    "CarIdxLapDistPct",
    "SessionTimeOfDay",
    "SessionTime",
    "SessionNum",
    "CarIdxSessionFlags",
  ];

  private _driverIndex: Record<string, Driver>;
  public get driverIndex() {
    return this._driverIndex;
  }

  private _config: SimIncidentEmitterConfig;

  public get config(): SimIncidentEmitterConfig {
    return this._config;
  }

  public set config(config: Partial<SimIncidentEmitterConfig>) {
    this._config = {
      ...this._config,
      ...config,
    };
  }

  constructor({ socket, config = DEFAULT_CONFIG }: SimIncidentEmitterOptions) {
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
    const nextIndex: Record<string, Driver> = chain(
      nextData.DriverInfo?.Drivers || [],
    )
      .filter(({ CarIsPaceCar }) => !CarIsPaceCar)
      .keyBy("CarIdx")
      .value();

    if (this.driverIndex) {
      const incidents = incidentsForDriverIndexUpdate(
        this.driverIndex,
        nextIndex,
        nextData,
        this.weightForIncidentValue,
      );

      if (!isEmpty(incidents)) {
        this.emit(SimIncidentEvents.SimIncidents, incidents);
      }
    }

    this._driverIndex = nextIndex;
  };

  private weightForIncidentValue = (incidentValue: number): number => {
    return Math.min(incidentValue, this.config.maxSimIncidentWeight);
  };
}

export default SimIncidentEmitter;
