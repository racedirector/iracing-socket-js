import React from "react";
import { Box } from "@chakra-ui/react";

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
    <h2>Repairs</h2>
    {totalFastRepairs > 0 && (
      <h5>{`Fast repairs: ${usedFastRepairs}/${totalFastRepairs}`}</h5>
    )}

    {requiredRepairTime > 0 ||
      (optionalRepairTime > 0 && (
        <>
          {requiredRepairTime > 0 && (
            <>
              <h5>Required</h5>
              <p>{requiredRepairTime}</p>
            </>
          )}

          {optionalRepairTime && (
            <>
              <h5>Optional</h5>
              <p>{optionalRepairTime}</p>
            </>
          )}
        </>
      ))}
  </Box>
);

export default RepairsRemaining;
