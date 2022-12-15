import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { ChakraProvider, Flex, Heading, Spacer } from "@chakra-ui/react";
import { IRacingSocketConnectionProvider } from "../../contexts/IRacingSocketConnection";
import { IRacing } from "../IRacing";
import { store } from "../../app/store";
import { ConnectionStatus } from "../ConnectionStatus";
import IRacingSocketConnectionInput from "../IRacingSocketConnectionInput";
import RaceLength from "../RaceLength";
import { SessionDetailsBadgeStack } from "../SessionDetailsBadgeStack";
import { useIRacingConnectionState } from "src/app/hooks";
import AppTabBar from "src/components/AppTabBar";
import { SessionInformation } from "../SessionInformation";
import { IncidentsTable } from "../../containers/IncidentsTable";
import { RaceStrategy } from "../../containers/RaceStrategy";
import FuelCalculator from "../FuelCalculator";
import { ReplayControls } from "../ReplayControls";
import ActiveDriversMenu from "../ActiveDriversMenu";

const AppProvider: React.FC<PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <IRacingSocketConnectionProvider>
          <IRacing>{children}</IRacing>
        </IRacingSocketConnectionProvider>
      </Provider>
    </ChakraProvider>
  );
};

const AppHeader: React.FC<Record<string, never>> = () => {
  return (
    <Flex
      align="center"
      backgroundColor="gray.800"
      color="white"
      paddingY={2.5}
      paddingX={5}
    >
      <Heading>iRacing Socket UI</Heading>
      <Spacer />
      <IRacingSocketConnectionInput />
      <Spacer />
      <ConnectionStatus />
    </Flex>
  );
};

const ComingSoon = () => <Heading>Coming soon</Heading>;

const AppUI: React.FC<Record<string, never>> = () => {
  const { isIRacingConnected } = useIRacingConnectionState();
  return (
    <div style={{ flex: 1 }}>
      <AppHeader />
      <ActiveDriversMenu title="Drivers" />

      {/**isIRacingConnected && (
        <>
          <Flex>
            <RaceLength />
            <SessionDetailsBadgeStack />
          </Flex>
          <AppTabBar
            sessionInformation={<SessionInformation />}
            leaderboard={<ComingSoon />}
            incidents={<IncidentsTable />}
            raceStrategy={<RaceStrategy />}
            fuelCalculator={<FuelCalculator />}
            replay={<ReplayControls />}
          />
        </>
      )**/}
    </div>
  );
};

export const App: React.FC<Record<string, never>> = () => {
  return (
    <AppProvider>
      <AppUI />
    </AppProvider>
  );
};

export default App;
