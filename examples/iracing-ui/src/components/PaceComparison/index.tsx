import React from "react";
import { Box, Flex, Heading, Text, VStack, Wrap } from "@chakra-ui/react";

export interface PaceComparisonDetailsProps {
  averageLapTime: number;
  currentDriver: string;
  teamName?: string;
  lastLapTime: number;
  bestLapTime: number;
  color?: string;
}

const PaceComparisonDetails: React.FC<PaceComparisonDetailsProps> = ({
  averageLapTime,
  lastLapTime,
  bestLapTime,
  currentDriver,
  teamName,
  color,
}) => {
  return (
    <Box flex={1} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex bg={color}>
        <Heading>{teamName || currentDriver}</Heading>
        {teamName && <Text>{currentDriver}</Text>}
      </Flex>

      <VStack>
        {averageLapTime && <Text>{`Average: ${averageLapTime}`}</Text>}
        {lastLapTime && <Text>{`Last: ${lastLapTime}`}</Text>}
        {bestLapTime && <Text>{`Best: ${bestLapTime}`}</Text>}
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
    <Flex>
      <Box>
        <PaceComparisonDetails {...target} color="teal" />
      </Box>
      <Wrap>
        {comparisons.map((props) => (
          <PaceComparisonDetails
            key={`${props.currentDriver}-${props.teamName}`}
            {...props}
          />
        ))}
      </Wrap>
    </Flex>
  );
};

export default PaceComparison;
