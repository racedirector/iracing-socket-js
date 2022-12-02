import React from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  Text,
  StatNumber,
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

      <StatGroup>
        {lapsComplete > 0 && (
          <Stat>
            <StatLabel>Laps:</StatLabel>
            <StatNumber>{lapsComplete}</StatNumber>
          </Stat>
        )}
        {averageLapTime > 0 && (
          <Stat>
            <StatLabel>Average:</StatLabel>
            <StatNumber>
              {normalizeLapDuration(moment.duration(averageLapTime, "seconds"))}
            </StatNumber>
          </Stat>
        )}
        {lastLapTime > 0 && (
          <Stat>
            <StatLabel>Last:</StatLabel>
            <StatNumber>
              {normalizeLapDuration(moment.duration(lastLapTime, "seconds"))}
            </StatNumber>
          </Stat>
        )}
        {bestLapTime > 0 && (
          <Stat>
            <StatLabel>Best:</StatLabel>
            <StatNumber>
              {normalizeLapDuration(moment.duration(bestLapTime, "seconds"))}
            </StatNumber>
          </Stat>
        )}
      </StatGroup>
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
