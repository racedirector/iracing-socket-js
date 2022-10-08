import { Box } from "@chakra-ui/react";
import React from "react";

interface FuelDisplayProps {
  usage: number;
  unit: string;
  toAdd: number;
  remaining: number;
}

const FuelDisplay: React.FC<FuelDisplayProps> = ({
  usage,
  unit,
  toAdd,
  remaining,
}) => {
  return (
    <Box>
      <Box>
        <h4>Usage</h4>
        <p>
          {usage}
          {unit}
        </p>
      </Box>
      <Box>
        <h4>To Add</h4>
        <p>
          {toAdd}
          {unit}
        </p>
      </Box>
      <Box>
        <h4>Remaining</h4>
        <p>
          {remaining}
          {unit}
        </p>
      </Box>
    </Box>
  );
};

export interface FuelCalculatorProps {
  lapsRemaining: number;
  fuelLevel: string;
  fuelUnit: string;
  // lastFuelUsage: number;
  // averageFuelUsage: number;
}

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({
  fuelLevel,
  fuelUnit,
  lapsRemaining,
  // lastFuelUsage,
  // averageFuelUsage,
}) => {
  return (
    <Box>
      <Box>
        <h5>Fuel Level</h5>
        <p>{fuelLevel}</p>
      </Box>
      <Box>
        <h5>Laps Remaining</h5>
        <p>{lapsRemaining}</p>
      </Box>
      {/* <FuelDisplay usage={lastFuelUsage} unit={fuelUnit} /> */}
      {/* <FuelDisplay usage={averageFuelUsage} unit={fuelUnit} /> */}
    </Box>
  );
};

export default FuelCalculator;
