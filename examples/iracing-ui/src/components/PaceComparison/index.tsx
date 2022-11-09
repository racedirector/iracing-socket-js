import React from "react";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { ActiveDriversMenu } from "src/containers/ActiveDriversMenu";

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

      <Grid>
        <Text>{`Average: ${averageLapTime}`}</Text>
        <Text>{`Last: ${lastLapTime}`}</Text>
        <Text>{`Best: ${bestLapTime}`}</Text>
      </Grid>
    </Box>
  );
};

export interface PaceComparisonProps {
  target: PaceComparisonDetailsProps;
  comparisons: PaceComparisonDetailsProps[];
  onTargetChange?: (carIndex: string) => void;
}

export const PaceComparison: React.FC<PaceComparisonProps> = ({
  target,
  comparisons,
  onTargetChange = () => {},
}) => {
  return (
    <Flex>
      <Box>
        <PaceComparisonDetails {...target} color="teal" />
        <ActiveDriversMenu
          title="Set target"
          colorScheme="red"
          onDriverSelect={onTargetChange}
        />
      </Box>
      <Box>
        {comparisons.map((props) => (
          <PaceComparisonDetails
            key={`${props.currentDriver}-${props.teamName}`}
            {...props}
          />
        ))}
      </Box>
    </Flex>
  );
};

export default PaceComparison;
