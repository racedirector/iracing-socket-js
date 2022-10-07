import React from "react";
import "./index.css";
import { TrackMap } from "../../containers/TrackMap";
import { ConnectionStatus } from "../../containers/ConnectionStatus";
import { Standings } from "../../containers/Standings";

const App: React.FC<Record<string, never>> = () => (
  <div style={{ flex: 1, backgroundColor: "gray" }}>
    <header className="App-header">
      <ConnectionStatus />
    </header>

    {/* <TrackMap /> */}
    <Standings />
  </div>
);

export default App;
