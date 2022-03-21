import { SimIncidentsConsumer, FlagsEvents } from "./flagConsumer";
import WS from "jest-websocket-mock";
import { Flags } from "../types";
import { flagsHasFlag } from "../utilities";
import { iRacingSocket } from "../core";

describe("Flags Consumer", () => {
  afterEach(() => {
    WS.clean();
  });

  const serverMockAddress = "localhost:8080";
  let serverMock: WS = null;

  beforeEach(() => {
    serverMock = new WS(`ws://${serverMockAddress}/ws`);
  });

  it("emits 'flagChange' (FlagsConsumerEvents.FlagChange) events when the flags change", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: SimIncidentsConsumer.requestParameters,
    });

    const mockFlagChange = jest.fn(() => {});
    const flagsConsumer = new SimIncidentsConsumer(socket).on(
      FlagsEvents.FlagChange,
      mockFlagChange,
    );

    // Wait for the socket to connect and mock an initial response...
    await serverMock.connected;
    serverMock.send(
      JSON.stringify({
        data: {
          SessionFlags: Flags.StartGo,
          SessionTime: 10,
          SessionTimeOfDay: 1000,
        },
      }),
    );

    // Flags should have changed
    expect(mockFlagChange).toBeCalled();
    expect(mockFlagChange).toBeCalledWith(undefined, Flags.StartGo, 10, 1000);

    // 60 seconds later, the catuion is shown...
    serverMock.send(
      JSON.stringify({
        data: {
          SessionFlags: Flags.CautionWaving,
          SessionTime: 70,
          SessionTimeOfDay: 1060,
        },
      }),
    );

    expect(mockFlagChange).toBeCalledTimes(2);
    expect(mockFlagChange).toBeCalledWith(
      Flags.StartGo,
      Flags.CautionWaving,
      70,
      1060,
    );
    expect(flagsHasFlag(flagsConsumer.flags, Flags.CautionWaving)).toBeTruthy();
  });
  it("keeps track of the flags after an update", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: SimIncidentsConsumer.requestParameters,
    });

    const mockFlagChange = jest.fn(() => {});
    const flagsConsumer = new SimIncidentsConsumer(socket).on(
      FlagsEvents.FlagChange,
      mockFlagChange,
    );

    // Wait for the socket to connect and mock an initial response...
    await serverMock.connected;
    serverMock.send(
      JSON.stringify({
        data: {
          SessionFlags: Flags.StartGo,
          SessionTime: 10,
          SessionTimeOfDay: 1000,
        },
      }),
    );

    // Flags should have changed
    expect(mockFlagChange).toBeCalled();
    expect(mockFlagChange).toBeCalledWith(undefined, Flags.StartGo, 10, 1000);
    expect(flagsConsumer.flags).toBe(Flags.StartGo);
  });
});
