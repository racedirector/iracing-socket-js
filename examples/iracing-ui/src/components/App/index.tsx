import React from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import "./index.css";
import { FlagIndicator } from "../../containers/FlagIndicator";
import { Drivers } from "../../containers/Drivers";
import { Cameras } from "../../containers/Cameras";
import { ChatMacros } from "../../containers/ChatMacros";
import { TrackMap } from "../../containers/TrackMap";
import WeatherConditions from "../../containers/WeatherConditions";

const App: React.FC<Record<string, never>> = () => {
  const { data, isIRacingConnected, isSocketConnected } = useIRacingContext();

  return (
    <div className="App">
      <header className="App-header">
        <h1>iRacing Socket UI</h1>
        <p>Socket connected? {isSocketConnected ? "yes" : "no"}</p>
        <p>iRacing connected? {isIRacingConnected ? "yes" : "no"}</p>
      </header>

      <body>
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
        {data && (
          <div className="Code-block">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </body>
    </div>
  );
};

export default App;
