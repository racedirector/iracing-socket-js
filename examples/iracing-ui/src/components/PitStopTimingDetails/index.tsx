import React from "react";
import { Box, VStack, Text } from "@chakra-ui/react";

export interface PitStopTimingDetailsProps {
  pitLaneTime?: number;
  pitStallTime?: number;
  serviceTime?: number;
}

export const PitStopTimingDetails: React.FC<PitStopTimingDetailsProps> = ({
  pitLaneTime,
  pitStallTime,
  serviceTime,
}) => {
  return (
    <Box flex={1} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <VStack>
        {pitLaneTime > 0 && <Text>{`Time in pit lane: ${pitLaneTime}`}</Text>}
        {pitStallTime > 0 && (
          <Text>{`Time in pit stall: ${pitStallTime}`}</Text>
        )}
        {serviceTime > 0 && <Text>{`Pit service time: ${serviceTime}`}</Text>}
      </VStack>
    </Box>
  );
};

export default PitStopTimingDetails;
