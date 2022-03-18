import WS from "jest-websocket-mock";
import { SimIncidentConsumer, SimIncidentEvents } from "./simIncidentConsumer";
import { iRacingSocket } from "../core";
import { Flags } from "../types";

const testDriver = {
  CarIdx: 1,
  UserID: 378767,
  CurDriverIncidentCount: 0,
};

describe("Sim Incident Consumer", () => {
  afterEach(() => {
    WS.clean();
  });

  const serverMockAddress = "localhost:8080";
  let serverMock: WS = null;

  beforeEach(() => {
    serverMock = new WS(`ws://${serverMockAddress}/ws`);
  });

  it("emits 'simIncidents' (SimIncidentEvents.Incidents) events that represent difference in incident count per update", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: SimIncidentConsumer.requestParameters,
    });

    const mockSimIncidentHandler = jest.fn(() => {});
    const simIncidentConsumer = new SimIncidentConsumer({ socket });
    simIncidentConsumer.on(
      SimIncidentEvents.SimIncidents,
      mockSimIncidentHandler,
    );

    // Wait for the socket to connect and mock an initial response...
    await serverMock.connected;

    // Send initial data
    serverMock.send(
      JSON.stringify({
        data: {
          CarIdxLapDistPct: [-1, 30],
          DriverInfo: {
            Drivers: [testDriver],
          },
          SessionTime: 900,
          SessionTimeOfDay: 910,
          SessionFlags: Flags.StartHidden,
          SessionNum: 1,
        },
      }),
    );

    expect(mockSimIncidentHandler).not.toBeCalled();

    // Send incident data
    serverMock.send(
      JSON.stringify({
        data: {
          CarIdxLapDistPct: [-1, 50],
          DriverInfo: {
            Drivers: [{ ...testDriver, CurDriverIncidentCount: 1 }],
          },
          SessionTime: 1000,
          SessionTimeOfDay: 1010,
          SessionFlags: Flags.StartHidden,
          SessionNum: 1,
        },
      }),
    );

    expect(mockSimIncidentHandler).toBeCalled();
    expect(mockSimIncidentHandler).toBeCalledWith({
      "1": {
        value: 1,
        weight: 1,
        sessionNumber: 1,
        sessionTime: 1000,
        sessionTimeOfDay: 1010,
        sessionFlags: Flags.StartHidden,
        lapPercentage: 50,
        driverId: 378767,
        carIndex: "1",
      },
    });
  });

  it("floors incident weights according to config", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: SimIncidentConsumer.requestParameters,
    });

    const mockSimIncidentHandler = jest.fn(() => {});
    const simIncidentConsumer = new SimIncidentConsumer({
      socket,
      config: {
        maxSimIncidentWeight: 2,
      },
    });
    simIncidentConsumer.on(
      SimIncidentEvents.SimIncidents,
      mockSimIncidentHandler,
    );

    // Wait for the socket to connect and mock an initial response...
    await serverMock.connected;

    // Send initial data
    serverMock.send(
      JSON.stringify({
        data: {
          CarIdxLapDistPct: [-1, 30],
          DriverInfo: {
            Drivers: [testDriver],
          },
          SessionTime: 900,
          SessionTimeOfDay: 910,
          SessionFlags: Flags.StartHidden,
          SessionNum: 1,
        },
      }),
    );

    expect(mockSimIncidentHandler).not.toBeCalled();

    // Send incident data
    serverMock.send(
      JSON.stringify({
        data: {
          CarIdxLapDistPct: [-1, 50],
          DriverInfo: {
            Drivers: [{ ...testDriver, CurDriverIncidentCount: 400 }],
          },
          SessionTime: 1000,
          SessionTimeOfDay: 1010,
          SessionFlags: Flags.StartHidden,
          SessionNum: 1,
        },
      }),
    );

    expect(mockSimIncidentHandler).toBeCalled();
    expect(mockSimIncidentHandler).toBeCalledWith({
      "1": {
        value: 400,
        weight: 2,
        sessionNumber: 1,
        sessionTime: 1000,
        sessionTimeOfDay: 1010,
        sessionFlags: Flags.StartHidden,
        lapPercentage: 50,
        driverId: 378767,
        carIndex: "1",
      },
    });
  });
});
