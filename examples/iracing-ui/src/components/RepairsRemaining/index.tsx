import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export interface RepairsRemainingProps {
  requiredRepairTime: number;
  optionalRepairTime: number;
  usedFastRepairs?: number;
  totalFastRepairs: number;
}

export const RepairsRemaining: React.FC<RepairsRemainingProps> = ({
  requiredRepairTime,
  optionalRepairTime,
  usedFastRepairs = 0,
  totalFastRepairs = 0,
}) => (
  <Box>
    <Heading>Repairs</Heading>
    <Heading>{`Fast repairs: ${usedFastRepairs}/${totalFastRepairs}`}</Heading>

    {requiredRepairTime > 0 ||
      (optionalRepairTime > 0 && (
        <>
          {requiredRepairTime > 0 && (
            <>
              <Heading>Required</Heading>
              <Text>{requiredRepairTime}</Text>
            </>
          )}

          {optionalRepairTime && (
            <>
              <Heading>Optional</Heading>
              <Text>{optionalRepairTime}</Text>
            </>
          )}
        </>
      ))}
  </Box>
);

export default RepairsRemaining;
