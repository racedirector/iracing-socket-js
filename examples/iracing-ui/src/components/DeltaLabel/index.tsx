import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

export interface DeltaLabelProps {
  timeDelta: number;
}

export const DeltaLabel: React.FC<DeltaLabelProps> = ({ timeDelta }) => {
  const isGain = Math.sign(timeDelta) === -1;

  return (
    <Flex>
      <Box>
        {isGain ? (
          <TriangleUpIcon color={"green.600"} />
        ) : (
          <TriangleDownIcon color={"red.600"} />
        )}
      </Box>
      <Box>
        <Text>{Math.abs(timeDelta)}</Text>
      </Box>
    </Flex>
  );
};
