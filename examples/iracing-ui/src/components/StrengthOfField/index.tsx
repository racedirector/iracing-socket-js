import React from "react";
import { Box } from "@chakra-ui/react";

interface ClassStrengthOfField {
  classColor: string;
  strength: number;
}

export interface StrengthOfFieldProps {
  totalStrengthOfField: number;
  index: {
    [className: string]: number; //ClassStrengthOfField;
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
        {Object.entries(index).map(
          ([className, strength /*{ classColor, strength }*/]) => {
            return (
              <div key={`${className}`}>
                <h3>{`${className}: ${strength.toFixed(1)}k`}</h3>
              </div>
            );
          },
        )}
      </>
    </Box>
  );
};

export default StrengthOfField;
