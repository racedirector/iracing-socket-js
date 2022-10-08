import React from "react";
import AppUI from "../../components/App";
import { ChakraProvider } from "@chakra-ui/react";
import { IRacingProvider } from "@racedirector/iracing-socket-js";

const host = "192.168.4.52";
const port = "8182";
const server = `${host}:${port}`;

export const App: React.FC<Record<string, never>> = () => {
  return (
    <ChakraProvider>
      <IRacingProvider
        server={server}
        fps={10}
        requestParameters={[
          "CameraInfo",
          "CarSetup",
          "DriverInfo",
          "QualifyResultsInfo",
          "RadioInfo",
          "SessionInfo",
          "SplitTimeInfo",
          "WeekendInfo",
          "__all_telemetry__",
        ]}
      >
        <AppUI />
      </IRacingProvider>
    </ChakraProvider>
  );
};

export default App;
