/* eslint-disable no-console */
import React, { useContext } from "react";
import { render, cleanup } from "@testing-library/react";
import WS from "jest-websocket-mock";
import { iRacingSocket } from "../../../core";
import IRacingProvider from "../iRacingProvider";
import { getIRacingContext } from "../iRacingContext";

describe("iRacingProvider", () => {
  afterEach(() => {
    cleanup();
    WS.clean();
  });

  let serverMock: WS = null;
  let socket: iRacingSocket = null;
  beforeEach(async () => {
    serverMock = new WS("ws://localhost:1234/ws");

    socket = new iRacingSocket({
      server: "localhost:1234",
      requestParameters: [],
    });

    await serverMock.connected;

    serverMock.send(
      JSON.stringify({
        data: {
          DriverInfo: {},
        },
      }),
    );
  });

  it("should render children components", async () => {
    const { getByText } = render(
      <IRacingProvider socket={socket}>
        <div className="unique">Test</div>
      </IRacingProvider>,
    );

    expect(getByText("Test")).toBeTruthy();
  });
  it("should add the socket to the child context", () => {
    const TestChild = () => {
      const context = useContext(getIRacingContext());
      expect(context.socket).toEqual(socket);
      return null;
    };

    render(
      <IRacingProvider socket={socket}>
        <TestChild />
        <TestChild />
      </IRacingProvider>,
    );
  });
});
