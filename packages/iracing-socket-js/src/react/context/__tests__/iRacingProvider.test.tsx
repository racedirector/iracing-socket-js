import { useContext } from "react";
import { render, cleanup } from "@testing-library/react";
import WS from "jest-websocket-mock";
import IRacingProvider from "../iRacingProvider";
import { iRacingContext } from "../iRacingContext";
import { iRacingSocketOptions } from "../../../core";

describe("iRacingProvider", () => {
  afterEach(() => {
    cleanup();
    WS.clean();
  });

  let serverMock: WS = null;
  let socket: iRacingSocketOptions = null;
  beforeEach(async () => {
    serverMock = new WS("ws://localhost:1234/ws");

    socket = {
      server: "localhost:1234",
      requestParameters: ["DriverInfo"],
    };

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
      <IRacingProvider {...socket}>
        <div className="unique">Test</div>
      </IRacingProvider>,
    );

    expect(getByText("Test")).toBeTruthy();
  });
  it("should add the socket to the child context", () => {
    const TestChild = () => {
      const context = useContext(iRacingContext);
      expect(context).toBeDefined();
      return null;
    };

    render(
      <IRacingProvider {...socket}>
        <TestChild />
        <TestChild />
      </IRacingProvider>,
    );
  });
});
