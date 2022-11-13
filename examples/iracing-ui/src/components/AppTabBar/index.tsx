import React from "react";
import { Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import { Standings } from "../../containers/Standings";

export interface AppTabBarProps {
  sessionInformation: React.ReactNode;
  leaderboard: React.ReactNode;
  incidents: React.ReactNode;
  fuelCalculator: React.ReactNode;
  raceStrategy: React.ReactNode;
  replay: React.ReactNode;
}

export const AppTabBar: React.FC<AppTabBarProps> = ({
  leaderboard,
  sessionInformation,
  incidents,
  fuelCalculator,
  raceStrategy,
  replay,
}) => (
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
      <TabPanel>{sessionInformation}</TabPanel>
      <TabPanel>
        <Standings />
      </TabPanel>
      <TabPanel>{leaderboard}</TabPanel>
      <TabPanel>{incidents}</TabPanel>
      <TabPanel>{fuelCalculator}</TabPanel>
      <TabPanel>{raceStrategy}</TabPanel>
      <TabPanel>{replay}</TabPanel>
    </TabPanels>
  </Tabs>
);

export default AppTabBar;
