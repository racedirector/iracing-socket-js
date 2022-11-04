import React from "react";
import { useIRacingConnectionState } from "src/app/hooks";
import "./index.css";
import {
  Flex,
  Heading,
  Spacer,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { ConnectionStatus } from "../../containers/ConnectionStatus";
import { FuelCalculator } from "../../containers/FuelCalculator";
import { SessionInformation } from "../../containers/SessionInformation";
import { Standings } from "../../containers/Standings";
import { Cameras } from "../../containers/Cameras";
import { IncidentsTable } from "../../containers/IncidentsTable";

const AppTabBar = () => (
  <Tabs isFitted variant="enclosed">
    <TabList mb="1em">
      <Tab>Session Information</Tab>
      <Tab>Leaderboard</Tab>
      <Tab>Relatives</Tab>
      <Tab>Incidents</Tab>
      <Tab>Fuel Calculator</Tab>
      <Tab>Strategy</Tab>
      <Tab>Camera</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <SessionInformation />
      </TabPanel>
      <TabPanel>
        <Standings />
      </TabPanel>
      <TabPanel>
        <Heading>Coming soon</Heading>
      </TabPanel>
      <TabPanel>
        <IncidentsTable />
      </TabPanel>
      <TabPanel>
        <FuelCalculator />
      </TabPanel>
      <TabPanel>
        <Heading>Coming soon</Heading>
      </TabPanel>
      <TabPanel>
        <Cameras />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

const App: React.FC<Record<string, never>> = () => {
  const { isIRacingConnected } = useIRacingConnectionState();

  return (
    <div style={{ flex: 1 }}>
      <Flex
        align="center"
        backgroundColor="#282c34"
        color="white"
        paddingBottom={2.5}
        paddingTop={2.5}
      >
        <Heading>iRacing Socket UI</Heading>
        <Spacer />
        <ConnectionStatus />
      </Flex>

      {isIRacingConnected && <AppTabBar />}
    </div>
  );
};

export default App;
