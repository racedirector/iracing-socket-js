import WS from "jest-websocket-mock";
import tk from "timekeeper";
import {
  iRacingSocket,
  PitServiceFlags,
  PitServiceStatus,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { PitTimingConsumer, PitTimingEvents } from "./";

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
            OnPitRoad: false,
            PlayerTrackSurface: TrackLocation.OnTrack,
            PitstopActive: false,
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
    const mockPitServiceRequestHandler = jest.fn(() => {});
    const mockPitServiceFuelLevelRequestHandler = jest.fn(() => {});

    const pitTimingConsumer = new PitTimingConsumer(socket);

    pitTimingConsumer
      .on(PitTimingEvents.PitEntry, mockPitEntryHandler)
      .on(PitTimingEvents.PitBoxEntry, mockPitBoxEntryHandler)
      .on(PitTimingEvents.PitBoxExit, mockPitBoxExitHandler)
      .on(PitTimingEvents.PitExit, mockPitExitHandler)
      .on(PitTimingEvents.PitServiceStatus, mockPitErrorHandler)
      .on(PitTimingEvents.PitServiceStart, mockPitServiceStartHandler)
      .on(PitTimingEvents.PitServiceEnd, mockPitServiceStopHandler)
      .on(PitTimingEvents.PitServiceRequest, mockPitServiceRequestHandler)
      .on(
        PitTimingEvents.PitServiceFuelLevelRequest,
        mockPitServiceFuelLevelRequestHandler,
      );

    await serverMock.connected;

    // Change track surface to approaching pits with pit stop set to refuel...
    serverMock.send(
      JSON.stringify({
        data: {
          PlayerTrackSurface: TrackLocation.ApproachingPits,
          PitSvFlags: PitServiceFlags.Fuel,
          PitSvFuel: 118,
        },
      }),
    );

    // Transition to on pit road
    serverMock.send(
      JSON.stringify({
        data: {
          OnPitRoad: true,
        },
      }),
    );

    expect(mockPitEntryHandler).toBeCalled();
    expect(mockPitEntryHandler).toBeCalledWith(timeOfExecution);

    // Transition to in the pit box
    serverMock.send(
      JSON.stringify({
        data: {
          PlayerTrackSurface: TrackLocation.InPitStall,
        },
      }),
    );

    expect(mockPitBoxEntryHandler).toBeCalled();
    expect(mockPitBoxEntryHandler).toBeCalledWith(timeOfExecution);

    // Miss the pit box (too far forward)
    serverMock.send(
      JSON.stringify({
        data: {
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
          PitstopActive: true,
          PlayerCarPitSvStatus: PitServiceStatus.InProgress,
        },
      }),
    );

    expect(mockPitServiceStartHandler).toBeCalled();
    expect(mockPitServiceStartHandler).toBeCalledWith(
      timeOfExecution,
      PitServiceFlags.Fuel,
      118,
    );

    // Stop the pit stop
    serverMock.send(
      JSON.stringify({
        data: {
          PitstopActive: false,
          PitSvFlags: 0x0,
          PitSvFuel: 0,
          PlayerCarPitSvStatus: PitServiceStatus.Complete,
        },
      }),
    );

    expect(mockPitServiceStopHandler).toBeCalled();
    expect(mockPitServiceStopHandler).toBeCalledWith(timeOfExecution);

    // Leave the pit box
    serverMock.send(
      JSON.stringify({
        data: {
          PlayerTrackSurface: TrackLocation.ApproachingPits,
          PlayerCarPitSvStatus: PitServiceStatus.None,
        },
      }),
    );

    expect(mockPitBoxExitHandler).toBeCalled();
    expect(mockPitBoxExitHandler).toBeCalledWith(timeOfExecution);

    // Leave the pit lane
    serverMock.send(
      JSON.stringify({
        data: {
          OnPitRoad: false,
        },
      }),
    );

    expect(mockPitEntryHandler).toBeCalled();
    expect(mockPitEntryHandler).toBeCalledWith(timeOfExecution);
  });
});
