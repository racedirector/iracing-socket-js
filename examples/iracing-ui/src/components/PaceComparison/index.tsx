import React from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { normalizeLapDuration } from "src/utils";
import moment from "moment";

export interface PaceComparisonDetailsProps {
  averageLapTime: number;
  currentDriver: string;
  teamName?: string;
  lastLapTime: number;
  bestLapTime: number;
  lapsComplete?: number;
  color?: string;
}

const PaceComparisonDetails: React.FC<PaceComparisonDetailsProps> = ({
  averageLapTime,
  lastLapTime,
  bestLapTime,
  currentDriver,
  teamName,
  lapsComplete,
  color,
}) => {
  return (
    <Box flex={1} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex bg={color}>
        <Heading size="md">{teamName || currentDriver}</Heading>
        {teamName && <Text>{currentDriver}</Text>}
      </Flex>

      <VStack>
        {lapsComplete > 0 && <Text>{`Laps: ${lapsComplete}`}</Text>}
        {averageLapTime > 0 && (
          <Text>{`Average: ${normalizeLapDuration(
            moment.duration(averageLapTime, "seconds"),
          )}`}</Text>
        )}
        {lastLapTime > 0 && (
          <Text>{`Last: ${normalizeLapDuration(
            moment.duration(lastLapTime, "seconds"),
          )}`}</Text>
        )}
        {bestLapTime > 0 && (
          <Text>{`Best: ${normalizeLapDuration(
            moment.duration(bestLapTime, "seconds"),
          )}`}</Text>
        )}
      </VStack>
    </Box>
  );
};

export interface PaceComparisonProps {
  target: PaceComparisonDetailsProps;
  comparisons: PaceComparisonDetailsProps[];
}

export const PaceComparison: React.FC<PaceComparisonProps> = ({
  target,
  comparisons,
}) => {
  return (
    <Box>
      <Box>
        <Heading>Target</Heading>
        <PaceComparisonDetails {...target} color="teal" />
      </Box>

      <Heading>Comparisons</Heading>
      <Grid templateColumns="repeat(3, 1fr)">
        {comparisons.map((props) => (
          <GridItem>
            <PaceComparisonDetails
              key={`${props.currentDriver}-${props.teamName}`}
              {...props}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default PaceComparison;
