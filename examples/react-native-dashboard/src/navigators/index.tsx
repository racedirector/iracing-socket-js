import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Flags from '../containers/Flags';
import PitTiming from '../containers/PitTiming';
import Incidents from '../containers/SimIncidents';
import DriverSwaps from '../containers/DriverSwaps';

const linking = {
  prefixes: [],
  config: {
    screens: {
      Flags: 'flags',
      DriverSwaps: 'driverSwaps',
      Incidents: 'incidents',
      PitTiming: 'pitTiming',
    },
  },
};

const Stack = createStackNavigator();

export interface NavigatorProps {}

export const Navigator: React.FC<NavigatorProps> = ({children}) => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="Flags" component={Flags} />
        <Stack.Screen name="DriverSwaps" component={DriverSwaps} />
        <Stack.Screen name="Incidents" component={Incidents} />
        <Stack.Screen name="PitTiming" component={PitTiming} />
      </Stack.Navigator>
      {children}
    </NavigationContainer>
  );
};

export default Navigator;
