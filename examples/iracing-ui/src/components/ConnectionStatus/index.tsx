import React from "react";
import {
  Badge,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";

interface ConnectionStatusIndicatorProps {
  connected: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  connected,
}) => (
  <Badge colorScheme={connected ? "green" : "red"}>
    {connected ? "Connected" : "Disconnected"}
  </Badge>
);

export interface ConnectionStatusProps {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isSocketConnected,
  isIRacingConnected,
}) => (
  <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)">
    <GridItem colSpan={1}>
      <Text>Socket: </Text>
    </GridItem>

    <GridItem colSpan={1}>
      <ConnectionStatusIndicator connected={isSocketConnected} />
    </GridItem>

    <GridItem colSpan={1}>
      <Text>iRacing: </Text>
    </GridItem>
    <GridItem colSpan={1}>
      <ConnectionStatusIndicator connected={isIRacingConnected} />
    </GridItem>
  </Grid>
);

export default ConnectionStatus;
