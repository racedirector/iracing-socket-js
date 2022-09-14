import React from "react";
import AppUI from "../../components/App";
import { IRacingProvider } from "@racedirector/iracing-socket-js";

const host = "192.168.4.52";
const port = "8182";

export const App: React.FC<Record<string, never>> = () => {
  return (
    <IRacingProvider
      server={`${host}:${port}`}
      requestParameters={[
        "CameraInfo",
        "CarSetup",
        "DriverInfo",
        "QualifyResultsInfo",
        "RadioInfo",
        "SessionInfo",
        "SplitTimeInfo",
        "WeekendInfo",
      ]}
    >
      <AppUI />
    </IRacingProvider>
  );
};

export default App;
