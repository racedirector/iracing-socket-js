import React from "react";
import { Box } from "@chakra-ui/react";

export interface StrengthOfFieldProps {
  totalStrengthOfField: number;
  index: {
    [className: string]: number;
  };
}

export const StrengthOfField: React.FC<StrengthOfFieldProps> = ({
  index,
  totalStrengthOfField = -1,
}) => {
  return (
    <Box>
      <>
        <h2>{`Strength of Field: ${
          totalStrengthOfField > 0 ? totalStrengthOfField.toFixed(1) : "Unknown"
        }`}</h2>
        {Object.entries(index).map(([className, strengthOfField]) => {
          return (
            <>
              <h3>{`${className}: ${strengthOfField.toFixed(1)}k`}</h3>
            </>
          );
        })}
      </>
    </Box>
  );
};

export default StrengthOfField;
