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
        fps={1}
        requestParameters={[
          "CamCameraNumber",
          "CamCameraState",
          "CamCarIdx",
          "CameraInfo",
          "CamGroupNumber",
          "CarIdxLapDistPct",
          "CarIdxOnPitRoad",
          "CarIdxTrackSurface",
          "DriverInfo",
          "IsReplayPlaying",
          "QualifyResultsInfo",
          "ReplayFrameNumEnd",
          "SessionFlags",
          "SessionInfo",
          "SessionNum",
          "WindDir",
          "WindVel",
        ]}
        requestParametersOnce={["WeekendInfo", "SplitTimeInfo"]}
      >
        <AppUI />
      </IRacingProvider>
    </ChakraProvider>
  );
};

export default App;
