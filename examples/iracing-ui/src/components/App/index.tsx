import React from "react";
import { useIRacingSocketConnectionState } from "@racedirector/iracing-socket-js";
import "./index.css";
import { ConnectionStatus } from "../../containers/ConnectionStatus";
import { FuelCalculator } from "../../containers/FuelCalculator";
import { FuelProvider } from "../../contexts/Fuel";

const App: React.FC<Record<string, never>> = () => {
  const { isIRacingConnected } = useIRacingSocketConnectionState();

  return (
    <div style={{ flex: 1 }}>
      <ConnectionStatus />
      {/* 
      {!isSocketConnected && (
        <SocketConnectionForm
          connecting={connecting}
          onSubmit={(values) => {
            setHost(values.host);
            setPort(values.port);
          }}
        />
      )} */}

      {isIRacingConnected && (
        <>
          {/* <StrengthOfFieldProvider> */}
          {/* <SessionInformation /> */}
          {/* </StrengthOfFieldProvider> */}

          {/* <Cameras /> */}

          <FuelProvider>
            <FuelCalculator />
          </FuelProvider>

          {/* <RepairsRemaining /> */}

          {/* <Standings /> */}
        </>
      )}
    </div>
  );
};

export default App;
