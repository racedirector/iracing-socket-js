import React from "react";
import { FuelCalculator as FuelCalculatorUI } from "src/components/FuelCalculator";
import { useFuelContext } from "../../contexts/FuelProvider";

export interface FuelCalculatorProps {}

export const FuelCalculator: React.FC<FuelCalculatorProps> = () => {
  const { averageUsageUnit, fuelLevel } = useFuelContext();
  return (
    <FuelCalculatorUI
      fuelLevel={fuelLevel}
      fuelUnit={averageUsageUnit}
      lapsRemaining={0}
    />
  );
};

export default FuelCalculator;
