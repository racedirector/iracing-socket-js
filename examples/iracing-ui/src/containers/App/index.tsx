import React from "react";
import AppUI from "../../components/App";
import { ChakraProvider } from "@chakra-ui/react";
import { IRacingProvider } from "@racedirector/iracing-socket-js";

const host = "192.168.4.52";
const port = "8182";

export const App: React.FC<Record<string, never>> = () => {
  return (
    <ChakraProvider>
      <IRacingProvider
        server={`${host}:${port}`}
        requestParameters={[
          "CameraInfo",
          "CamCameraNumber",
          "CamCameraState",
          "CamCarIdx",
          "CamGroupNumber",
          // "CarSetup",
          "DriverInfo",
          "QualifyResultsInfo",
          "SplitTimeInfo",
          "SessionFlags",
          // "WeekendInfo",
        ]}
      >
        <AppUI />
      </IRacingProvider>
    </ChakraProvider>
  );
};

export default App;
