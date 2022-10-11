import React from "react";
import "./index.css";
import { ConnectionStatus } from "../../containers/ConnectionStatus";
import { Standings } from "../../containers/Standings";
import { SessionInformation } from "../../containers/SessionInformation";
import { FuelCalculator } from "../../containers/FuelCalculator";
import { FuelProvider } from "src/contexts/Fuel";
import { Cameras } from "../../containers/Cameras";
import { RepairsRemaining } from "../../containers/RepairsRemaining";
import { StrengthOfFieldProvider } from "src/contexts/StrengthOfField";

const App: React.FC<Record<string, never>> = () => (
  <div style={{ flex: 1, backgroundColor: "gray" }}>
    <header className="App-header">
      <ConnectionStatus />
    </header>

    <StrengthOfFieldProvider>
      <SessionInformation />
    </StrengthOfFieldProvider>

    <Cameras />

    <FuelProvider>
      <FuelCalculator />
    </FuelProvider>

    <RepairsRemaining />

    <Standings />
  </div>
);

export default App;
