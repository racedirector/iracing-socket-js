import {
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketOptions,
} from "./socket";
import WS from "jest-websocket-mock";
import wait from "waait";
import { iRacingSocketCommands } from "../types";

describe("iRacing Socket", () => {
  afterEach(() => {
    WS.clean();
  });

  const serverMockAddress = "localhost:8080";
  let serverMock: WS = null;

  const defaultSocketOptions: iRacingSocketOptions = {
    server: serverMockAddress,
    fps: 1,
    requestParameters: ["DriverInfo"],
    requestParametersOnce: ["WeekendInfo"],
    readIBT: true,
    reconnectTimeoutInterval: 200,
  };

  const expectedMessage = JSON.stringify({
    fps: defaultSocketOptions.fps,
    readIbt: defaultSocketOptions.readIBT,
    requestParams: defaultSocketOptions.requestParameters,
    requestParamsOnce: defaultSocketOptions.requestParametersOnce,
  });

  const defaultResponse = JSON.stringify({
    data: { DriverInfo: {}, WeekendInfo: {} },
  });

  beforeEach(() => {
    serverMock = new WS(`ws://${serverMockAddress}/ws`);
  });

  it("emits 'connect' events on it's `socketConnectionEmitter` when the websocket connects", async () => {
    const socket = new iRacingSocket(defaultSocketOptions);
    const mockConnectHandler = jest.fn(() => {});
    socket.socketConnectionEmitter.on(
      iRacingSocketConnectionEvents.Connect,
      mockConnectHandler,
    );

    await serverMock.connected;

    expect(mockConnectHandler).toBeCalled();
  });
  it("emits 'disconnect' events on it's `socketConnectionEmitter` when the websocket disconnects", async () => {
    const socket = new iRacingSocket(defaultSocketOptions);
    const mockDisconnectHandler = jest.fn(() => {});
    socket.socketConnectionEmitter.on(
      iRacingSocketConnectionEvents.Disconnect,
      mockDisconnectHandler,
    );

    await serverMock.connected;

    // Close the connection
    serverMock.close();
    await serverMock.closed;

    expect(mockDisconnectHandler).toBeCalled();
  });

  describe("websocket connected", () => {
    it("can send commands to the server", async () => {
      const socket = new iRacingSocket(defaultSocketOptions);

      await serverMock.connected;

      await serverMock.nextMessage;

      socket.sendCommand(iRacingSocketCommands.ChatCommandMacro, [8]);

      // await serverMock.nextMessage;

      expect(serverMock).toReceiveMessage(
        JSON.stringify({ command: "chat_command_macro", args: [8] }),
      );
    });
    it("sends it's parameters to the server when connection is established", async () => {
      new iRacingSocket(defaultSocketOptions);

      await serverMock.connected;

      expect(serverMock).toReceiveMessage(expectedMessage);
    });
    it("emits 'connect' events on it's `iRacingConnectionEmitter` when the iRacing client connects", async () => {
      const socket = new iRacingSocket(defaultSocketOptions);
      const mockConnectHandler = jest.fn(() => {});
      socket.iRacingConnectionEmitter.on(
        iRacingSocketConnectionEvents.Connect,
        mockConnectHandler,
      );

      await serverMock.connected;
      await serverMock.nextMessage;
      serverMock.send(defaultResponse);

      expect(mockConnectHandler).toBeCalled();
    });
    it("emits 'disconnect' events on it's `iRacingConnectionEmitter` when the iRacing client disconnects", async () => {
      const socket = new iRacingSocket(defaultSocketOptions);
      const mockDisconnectHandler = jest.fn(() => {});
      socket.iRacingConnectionEmitter.on(
        iRacingSocketConnectionEvents.Connect,
        mockDisconnectHandler,
      );

      await serverMock.connected;

      serverMock.send(defaultResponse);
      serverMock.close();

      await serverMock.closed;

      expect(mockDisconnectHandler).toBeCalled();
    });
  });

  describe("reconnect", () => {
    it.skip("will attempt to reconnect after `reconnectTimeoutInterval` if connection is interrupted", async () => {
      const socket = new iRacingSocket(defaultSocketOptions);

      expect(socket.reconnectTimeoutInterval).toEqual(200);

      // Wait for the socket to connect and send it's first message
      await serverMock.connected;
      await serverMock.nextMessage;

      // Send a response to finish the connection
      serverMock.send(defaultResponse);

      expect(socket.connected).toBeTruthy();

      // Set up a spy on the `open` function on the socket.
      // Since `open` is called at the end of the constructor
      // of the socket, this should not be called, and the
      // following assertion ensures such.
      const openSpy = jest.spyOn(socket, "open");
      expect(openSpy).not.toBeCalled();

      // Have the server disconnect the socket
      serverMock.close();
      await serverMock.closed;

      // Wait for longer than the reconnect
      await wait(defaultSocketOptions.reconnectTimeoutInterval);

      // Expect that the socket attempted to reconnect
      expect(openSpy).toBeCalledTimes(1);

      await wait(defaultSocketOptions.reconnectTimeoutInterval + 2);

      expect(openSpy).toBeCalledTimes(2);

      openSpy.mockRestore();
    });

    it.skip("is cancellable", async () => {
      serverMock.close();
      await serverMock.closed;

      const socket = new iRacingSocket(defaultSocketOptions);
      const openSpy = jest.spyOn(socket, "open");
      expect(openSpy).not.toBeCalled();

      await wait(defaultSocketOptions.reconnectTimeoutInterval + 2);

      expect(openSpy).toBeCalledTimes(1);
      openSpy.mockClear();

      socket.cancelRetry();

      await wait(1000);

      expect(openSpy).not.toBeCalled();
    });
  });

  describe("errors", () => {
    it("disconnects from the server on error", async () => {
      const socket = new iRacingSocket(defaultSocketOptions);
      const mockSocketDisconnectHandler = jest.fn(() => {});
      socket.socketConnectionEmitter.on(
        iRacingSocketConnectionEvents.Disconnect,
        mockSocketDisconnectHandler,
      );
      const mockIRacingDisconnectHandler = jest.fn(() => {});
      socket.iRacingConnectionEmitter.on(
        iRacingSocketConnectionEvents.Connect,
        mockIRacingDisconnectHandler,
      );

      await serverMock.connected;
      await serverMock.nextMessage;
      serverMock.send(defaultResponse);
      serverMock.error();

      await wait(1);

      expect(mockSocketDisconnectHandler).toBeCalled();
      expect(mockIRacingDisconnectHandler).toBeCalled();
      expect(socket.connected).toBeFalsy();
    });
  });
});
