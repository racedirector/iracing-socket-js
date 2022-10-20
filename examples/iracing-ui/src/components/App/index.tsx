import React from "react";
import { useIRacingSocketConnectionState } from "@racedirector/iracing-socket-js";
import "./index.css";
import { ConnectionStatus } from "../../containers/ConnectionStatus";
import { FuelCalculator } from "../../containers/FuelCalculator";
import { SessionInformation } from "../../containers/SessionInformation";
import { Flex, Heading, HStack } from "@chakra-ui/react";

const App: React.FC<Record<string, never>> = () => {
  const { isIRacingConnected } = useIRacingSocketConnectionState();

  return (
    <div style={{ flex: 1 }}>
      <Flex
        align="center"
        backgroundColor="#282c34"
        color="white"
        paddingBottom={2.5}
        paddingTop={2.5}
      >
        <HStack spacing={10}>
          <Heading>iRacing Socket UI</Heading>
          <ConnectionStatus />
        </HStack>
      </Flex>

      {isIRacingConnected && (
        <>
          <SessionInformation />

          {/* <Cameras /> */}

          <FuelCalculator />

          {/* <RepairsRemaining /> */}

          {/* <Standings /> */}
        </>
      )}
    </div>
  );
};

export default App;
