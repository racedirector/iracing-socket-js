import React from "react";
import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";

export interface ConnectionStatusProps {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isSocketConnected,
  isIRacingConnected,
}) => (
  <Flex
    align="center"
    backgroundColor="#282c34"
    color="white"
    paddingBottom={2.5}
    paddingTop={2.5}
  >
    <HStack spacing={10}>
      <Heading>iRacing Socket UI</Heading>
      <Box>
        <Text>Socket connected? {isSocketConnected ? "yes" : "no"}</Text>
        <Text>iRacing connected? {isIRacingConnected ? "yes" : "no"}</Text>
      </Box>
    </HStack>
  </Flex>
);

export default ConnectionStatus;
