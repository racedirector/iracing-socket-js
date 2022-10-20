import React, { useMemo } from "react";
import {
  FuelCalculator as FuelCalculatorUI,
  FuelCalculatorProps as FuelCalculatorUIProps,
} from "src/components/FuelCalculator";
import { useFuelUnit } from "src/hooks/useFuelUnit";
import { useFuel } from "src/contexts/Fuel";
import { useRaceLength } from "src/contexts/RaceLength";

export interface FuelCalculatorProps {}

export const FuelCalculator: React.FC<FuelCalculatorProps> = () => {
  const {
    averageUsage,
    lastUsage,
    lastFuelLapsRemaining,
    lastFuelCalculation,
    lastFuelLevel,
    averageFuelLapsRemaining,
    averageFuelCalculation,
  } = useFuel();
  const { raceLaps, lapsRemaining } = useRaceLength();
  const fuelUnit = useFuelUnit();

  const averageFuelUsageProps = useMemo<
    FuelCalculatorUIProps["averageFuelUsage"]
  >(
    () => ({
      usage: averageUsage,
      remaining: averageFuelLapsRemaining,
      toAdd: averageFuelCalculation,
      unit: fuelUnit,
    }),
    [averageUsage, averageFuelCalculation, averageFuelLapsRemaining, fuelUnit],
  );

  const lastFuelUsageProps = useMemo<FuelCalculatorUIProps["lastFuelUsage"]>(
    () => ({
      usage: lastUsage,
      remaining: lastFuelLapsRemaining,
      toAdd: lastFuelCalculation,
      unit: fuelUnit,
    }),
    [lastUsage, lastFuelLapsRemaining, lastFuelCalculation, fuelUnit],
  );

  return (
    <FuelCalculatorUI
      fuelLevel={lastFuelLevel.toFixed(2)}
      fuelUnit={fuelUnit}
      raceLaps={raceLaps}
      raceLapsRemaining={lapsRemaining}
      averageFuelUsage={averageFuelUsageProps}
      lastFuelUsage={lastFuelUsageProps}
    />
  );
};

export default FuelCalculator;
