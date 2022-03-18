import WS from "jest-websocket-mock";
import tk from "timekeeper";
import { PitTimingConsumer, PitTimingEvents } from "./pitTimingConsumer";
import { iRacingSocket } from "../core";
import { PitServiceFlags, PitServiceStatus, TrackLocation } from "../types";

describe("Pit Timing Consumer", () => {
  // !!!: "Freeze" time so all `new Date()` instances within the
  // tested fixtures are `timeOfExecution`.
  const timeOfExecution = new Date();
  beforeAll(() => {
    tk.freeze(timeOfExecution);
  });

  afterAll(() => {
    tk.reset();
  });

  afterEach(() => {
    WS.clean();
  });

  const serverMockAddress = "localhost:8080";
  let serverMock: WS = null;
  beforeEach(() => {
    serverMock = new WS(`ws://${serverMockAddress}/ws`);
    serverMock.on("connection", (socket) => {
      socket.send(
        JSON.stringify({
          data: {
            DriverInfo: {
              DriverCarIdx: 0,
            },
            CarIdxOnPitRoad: [0],
            CarIdxTrackSurface: [TrackLocation.OnTrack],
            PitStopActive: false,
            PitSvFlags: 0x0,
            PitSvFuel: 0,
            PlayerCarPitSvStatus: PitServiceStatus.None,
          },
        }),
      );
    });
  });

  it("emits for all stages of a pit stop", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: PitTimingConsumer.requestParameters,
    });

    const mockPitEntryHandler = jest.fn(() => {});
    const mockPitBoxEntryHandler = jest.fn(() => {});
    const mockPitErrorHandler = jest.fn(() => {});
    const mockPitServiceStartHandler = jest.fn(() => {});
    const mockPitServiceStopHandler = jest.fn(() => {});
    const mockPitBoxExitHandler = jest.fn(() => {});
    const mockPitExitHandler = jest.fn(() => {});

    const pitTimingConsumer = new PitTimingConsumer(socket);
    pitTimingConsumer.on(PitTimingEvents.PitEntry, mockPitEntryHandler);
    pitTimingConsumer.on(PitTimingEvents.PitBoxEntry, mockPitBoxEntryHandler);
    pitTimingConsumer.on(PitTimingEvents.PitBoxExit, mockPitBoxExitHandler);
    pitTimingConsumer.on(PitTimingEvents.PitExit, mockPitExitHandler);
    pitTimingConsumer.on(PitTimingEvents.PitServiceError, mockPitErrorHandler);
    pitTimingConsumer.on(
      PitTimingEvents.PitServiceStart,
      mockPitServiceStartHandler,
    );
    pitTimingConsumer.on(
      PitTimingEvents.PitServiceEnd,
      mockPitServiceStopHandler,
    );

    await serverMock.connected;

    // Change track surface to approaching pits with pit stop set to refuel...
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [0],
          CarIdxTrackSurface: [TrackLocation.ApproachingPits],
          PitStopActive: false,
          PitSvFlags: PitServiceFlags.Fuel,
          PitSvFuel: 118,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    // Transition to on pit road
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [1],
          CarIdxTrackSurface: [TrackLocation.ApproachingPits],
          PitStopActive: false,
          PitSvFlags: PitServiceFlags.Fuel,
          PitSvFuel: 118,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitEntryHandler).toBeCalled();
    expect(mockPitEntryHandler).toBeCalledWith(0, timeOfExecution);

    // Transition to in the pit box
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [1],
          CarIdxTrackSurface: [TrackLocation.InPitStall],
          PitStopActive: false,
          PitSvFlags: PitServiceFlags.Fuel,
          PitSvFuel: 118,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitBoxEntryHandler).toBeCalled();
    expect(mockPitBoxEntryHandler).toBeCalledWith(0, timeOfExecution);

    // Miss the pit box (too far forward)
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [1],
          CarIdxTrackSurface: [TrackLocation.InPitStall],
          PitStopActive: false,
          PitSvFlags: PitServiceFlags.Fuel,
          PitSvFuel: 118,
          PlayerCarPitSvStatus: PitServiceStatus.TooFarForward,
        },
      }),
    );

    expect(mockPitErrorHandler).toBeCalled();
    expect(mockPitErrorHandler).toBeCalledWith(
      PitServiceStatus.TooFarForward,
      timeOfExecution,
    );

    // Fix the car, start the pit stop
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [1],
          CarIdxTrackSurface: [TrackLocation.InPitStall],
          PitStopActive: true,
          PitSvFlags: PitServiceFlags.Fuel,
          PitSvFuel: 118,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitServiceStartHandler).toBeCalled();
    expect(mockPitServiceStartHandler).toBeCalledWith(
      0,
      timeOfExecution,
      PitServiceFlags.Fuel,
      118,
    );

    // Stop the pit stop
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [1],
          CarIdxTrackSurface: [TrackLocation.InPitStall],
          PitStopActive: false,
          PitSvFlags: 0x0,
          PitSvFuel: 0,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitServiceStopHandler).toBeCalled();
    expect(mockPitServiceStopHandler).toBeCalledWith(0, timeOfExecution);

    // Leave the pit box
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [1],
          CarIdxTrackSurface: [TrackLocation.ApproachingPits],
          PitStopActive: false,
          PitSvFlags: 0x0,
          PitSvFuel: 0,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitBoxExitHandler).toBeCalled();
    expect(mockPitBoxExitHandler).toBeCalledWith(0, timeOfExecution);

    // Leave the pit lane
    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {
            DriverCarIdx: 0,
          },
          CarIdxOnPitRoad: [0],
          CarIdxTrackSurface: [TrackLocation.ApproachingPits],
          PitStopActive: false,
          PitSvFlags: 0x0,
          PitSvFuel: 0,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitEntryHandler).toBeCalled();
    expect(mockPitEntryHandler).toBeCalledWith(0, timeOfExecution);
  });
});
