import WS from "jest-websocket-mock";
import { iRacingSocket } from "@racedirector/iracing-socket-js";
import { DriverSwapEmitter, DriverSwapEvents } from "./";

const driverMakaila = {
  CarIdx: 1,
  UserID: 378767,
};

const driverEarnhardtJr = {
  CarIdx: 2,
  UserID: 370235,
};

const driverAlonso = {
  CarIdx: 1,
  UserID: 524549,
};

describe("Driver Swap Emitter", () => {
  afterEach(() => {
    WS.clean();
  });

  const serverMockAddress = "localhost:8080";
  let serverMock: WS = null;

  beforeEach(() => {
    serverMock = new WS(`ws://${serverMockAddress}/ws`);
  });

  it("emits 'driverSwaps' (DriverSwapEvents.DriverSwaps) events that represent detected driver swaps per update", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: DriverSwapEmitter.requestParameters,
    });

    const mockDriverSwapHandler = jest.fn(() => {});
    const driverSwapConsumer = new DriverSwapEmitter(socket);
    driverSwapConsumer.on(DriverSwapEvents.DriverSwaps, mockDriverSwapHandler);

    // Wait for the socket to connect and mock an initial response...
    await serverMock.connected;

    // Send initial data
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            Drivers: [driverMakaila],
          },
        },
      }),
    );

    // No driver swap because this is initial data.
    expect(mockDriverSwapHandler).not.toBeCalled();

    // Send driver joined data
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            Drivers: [driverMakaila, driverEarnhardtJr],
          },
        },
      }),
    );

    // Expect a driver swap event representing the driver joining
    expect(mockDriverSwapHandler).toBeCalled();
    expect(mockDriverSwapHandler).toBeCalledWith({
      "2": {
        from: undefined,
        to: driverEarnhardtJr,
      },
    });

    // Swap in Alonso for Makaila
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            Drivers: [driverAlonso, driverEarnhardtJr],
          },
        },
      }),
    );

    // Expect to receive an index where the key is the "CarIdx",
    // and the value is the driver swap for the car.
    expect(mockDriverSwapHandler).toBeCalled();
    expect(mockDriverSwapHandler).toBeCalledWith({
      "1": {
        from: driverMakaila,
        to: driverAlonso,
      },
    });
  });
});
