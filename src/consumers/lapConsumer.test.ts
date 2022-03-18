import WS from "jest-websocket-mock";
import { LapConsumer, LapEvents } from "./lapConsumer";
import { iRacingSocket } from "../core";
import { Flags } from "../types";

describe("Lap Consumer", () => {
  afterEach(() => {
    WS.clean();
  });

  const serverMockAddress = "localhost:8080";
  let serverMock: WS = null;

  beforeEach(() => {
    serverMock = new WS(`ws://${serverMockAddress}/ws`);
  });

  it("emits 'lapChange' (LapEvents.LapChange) events each time the lap changes", async () => {
    const socket = new iRacingSocket({
      server: serverMockAddress,
      requestParameters: LapConsumer.requestParameters,
    });

    const mockLapChange = jest.fn(() => {});
    const lapConsumer = new LapConsumer(socket).on(
      LapEvents.LapChange,
      mockLapChange,
    );

    await serverMock.connected;

    serverMock.send(
      JSON.stringify({
        data: {
          RaceLaps: 10,
          SessionFlags: Flags.StartHidden,
        },
      }),
    );

    expect(mockLapChange).toBeCalled();
    expect(mockLapChange).toBeCalledWith(10, [10], [], []);
    expect(lapConsumer.currentLap).toBe(10);
    expect(lapConsumer.flags).toBe(Flags.StartHidden);
    expect(lapConsumer.greenLaps).toStrictEqual([10]);
    expect(lapConsumer.cautionLaps).toEqual([]);
    expect(lapConsumer.restartLaps).toEqual([]);
  });
  describe("lap tracking", () => {
    it("properly tracks green laps", async () => {
      // A green flag lap is a lap when the green flag is still out upon completion
      const socket = new iRacingSocket({
        server: serverMockAddress,
        requestParameters: LapConsumer.requestParameters,
      });

      const mockLapChange = jest.fn(() => {});
      const lapConsumer = new LapConsumer(socket);
      lapConsumer.on(LapEvents.LapChange, mockLapChange);

      await serverMock.connected;

      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 10,
            SessionFlags: Flags.StartHidden,
          },
        }),
      );

      expect(mockLapChange).toBeCalled();
      expect(mockLapChange).toBeCalledWith(10, [10], [], []);

      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 11,
            SessionFlags: Flags.StartHidden,
          },
        }),
      );

      expect(mockLapChange).toBeCalled();
      expect(mockLapChange).toBeCalledWith(11, [10, 11], [], []);
    });
    it("properly tracks caution laps", async () => {
      // A caution lap is a lap when the caution flag is initially shown, and any following
      // laps while the caution is out. (caution waving, caution)
      const socket = new iRacingSocket({
        server: serverMockAddress,
        requestParameters: LapConsumer.requestParameters,
      });

      const mockLapChange = jest.fn(() => {});
      const lapConsumer = new LapConsumer(socket);
      lapConsumer.on(LapEvents.LapChange, mockLapChange);

      await serverMock.connected;

      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 10,
            SessionFlags: Flags.StartHidden,
          },
        }),
      );

      expect(mockLapChange).toBeCalled();
      expect(mockLapChange).toHaveBeenLastCalledWith(10, [10], [], []);

      // Caution waving comes out on lap 10
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 10,
            SessionFlags: Flags.CautionWaving,
          },
        }),
      );

      expect(lapConsumer.isCaution).toBeTruthy();

      // Expect no event
      expect(mockLapChange).toBeCalledTimes(1);

      // Lap changes, flag changes to caution
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 11,
            SessionFlags: Flags.Caution,
          },
        }),
      );

      expect(lapConsumer.isCaution).toBeTruthy();
      expect(mockLapChange).toBeCalledTimes(2);
      expect(mockLapChange).toHaveBeenLastCalledWith(11, [10], [11], []);
    });
    it.skip("properly tracks restart laps", async () => {
      // !!!: A restart lap is considered the lap when the pace car comes in
      // and the following green flag lap. (one to green lap, and green lap)
      const socket = new iRacingSocket({
        server: serverMockAddress,
        requestParameters: LapConsumer.requestParameters,
      });

      const mockLapChange = jest.fn(() => {});
      const lapConsumer = new LapConsumer(socket);
      lapConsumer.on(LapEvents.LapChange, mockLapChange);

      await serverMock.connected;

      // Send initial state data (Lap 11, under caution)
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 11,
            SessionFlags: Flags.Caution,
          },
        }),
      );

      expect(lapConsumer.isCaution).toBeTruthy();
      expect(mockLapChange).toBeCalled();
      expect(mockLapChange).toBeCalledWith(11, [], [11], []);

      // Lap 12, one to green!
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 12,
            SessionFlags: Flags.Caution | Flags.OneLapToGreen,
          },
        }),
      );

      expect(lapConsumer.isCaution).toBeTruthy();
      expect(mockLapChange).toBeCalledTimes(2);
      expect(mockLapChange).toHaveBeenLastCalledWith(
        // Current lap is 12
        12,
        // Green laps
        [],
        // Caution laps
        [11, 12],
        // Restart laps
        [],
      );

      // Lap 12, about to go green!
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 12,
            SessionFlags: Flags.Caution | Flags.OneLapToGreen | Flags.GreenHeld,
          },
        }),
      );

      expect(mockLapChange).toBeCalledTimes(2);

      // End of lap 12, green!
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 12,
            SessionFlags: Flags.Green,
          },
        }),
      );

      // Start lap 13!
      serverMock.send(
        JSON.stringify({
          data: {
            RaceLaps: 13,
            SessionFlags: Flags.Green | Flags.StartHidden,
          },
        }),
      );

      expect(lapConsumer.isCaution).toBeFalsy();
      expect(mockLapChange).toBeCalledTimes(3);
      expect(mockLapChange).toHaveBeenLastCalledWith(
        // Current lap is 13
        13,
        // Green laps
        [13],
        // Caution laps
        [11, 12],
        // Restart laps
        [13],
      );
    });
  });
});
