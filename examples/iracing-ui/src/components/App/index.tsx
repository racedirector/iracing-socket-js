import React from "react";
import "./index.css";
import { TrackMap } from "../../containers/TrackMap";
import { ConnectionStatus } from "../../containers/ConnectionStatus";
import { Standings } from "../../containers/Standings";
import { SessionInformation } from "../../containers/SessionInformation";
import { FuelCalculator } from "../../containers/FuelCalculator";
import { FuelProvider } from "src/contexts/FuelProvider";
import { Cameras } from "../../containers/Cameras";

const App: React.FC<Record<string, never>> = () => (
  <div style={{ flex: 1, backgroundColor: "gray" }}>
    <header className="App-header">
      <ConnectionStatus />
    </header>

    {/* <TrackMap /> */}
    <SessionInformation />
    <Cameras />
    <FuelProvider>
      <FuelCalculator />
    </FuelProvider>
    <Standings />
  </div>
);

export default App;
