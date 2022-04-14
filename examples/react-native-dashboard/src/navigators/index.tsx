import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Flags from "../containers/Flags";
import PitTiming from "../containers/PitTiming";
import Incidents from "../containers/SimIncidents";
import DriverSwaps from "../containers/DriverSwaps";

const linking = {
  prefixes: [],
  config: {
    screens: {
      Flags: "flags",
      DriverSwaps: "driverSwaps",
      Incidents: "incidents",
      PitTiming: "pitTiming",
    },
  },
};

const Drawer = createDrawerNavigator();

export interface NavigatorProps {}

export const Navigator: React.FC<NavigatorProps> = ({ children }) => {
  return (
    <NavigationContainer linking={linking}>
      <Drawer.Navigator>
        <Drawer.Screen name="Flags" component={Flags} />
        <Drawer.Screen name="DriverSwaps" component={DriverSwaps} />
        <Drawer.Screen name="Incidents" component={Incidents} />
        <Drawer.Screen name="PitTiming" component={PitTiming} />
      </Drawer.Navigator>
      {children}
    </NavigationContainer>
  );
};

export default Navigator;
