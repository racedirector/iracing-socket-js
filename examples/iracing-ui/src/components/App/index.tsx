import React from "react";
import "./index.css";
// import { FlagIndicator } from "../../containers/FlagIndicator";
// import { Drivers } from "../../containers/Drivers";
// import { Cameras } from "../../containers/Cameras";
// import { ChatMacros } from "../../containers/ChatMacros";
import { TrackMap } from "../../containers/TrackMap";
import { ConnectionStatus } from "../../containers/ConnectionStatus";

const App: React.FC<Record<string, never>> = () => (
  <div style={{ flex: 1 }}>
    <header className="App-header">
      <ConnectionStatus />
    </header>

    <TrackMap />
    {/* <Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(1, 1fr)">
          <GridItem bg="tomato">
            <WeatherConditions />
          </GridItem>

          <GridItem>
            <TrackMap />
          </GridItem>

          <GridItem>
            <FlagIndicator />
          </GridItem>
        </Grid>

        <ChatMacros />
        <Cameras />
        <Drivers /> */}
  </div>
);

export default App;
