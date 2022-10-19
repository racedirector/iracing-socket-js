import React, { useMemo, useState } from "react";
import {
  FuelCalculator as FuelCalculatorUI,
  FuelCalculatorProps as FuelCalculatorUIProps,
} from "src/components/FuelCalculator";
import { useRemainingLapsForCurrentDriverClass } from "src/hooks/useAveragePaceForClass";
import { useFuel, useFuelUnit } from "src/hooks/useFuel";

const lapsRemaining: (fuelLevel: number, usagePerLap: number) => number = (
  fuelLevel,
  usagePerLap,
) => (usagePerLap <= 0 ? 0 : +(fuelLevel / usagePerLap).toFixed(2));

export interface FuelCalculatorProps {}

export const FuelCalculator: React.FC<FuelCalculatorProps> = () => {
  const { averageUsage, lastLapUsage, lastFuelLevel } = useFuel();
  const fuelUnit = useFuelUnit();
  const raceLapsRemaining = useRemainingLapsForCurrentDriverClass();
  const [customUsage, setCustomUsage] = useState(0);

  const averageLapsRemaining = useMemo(
    () => lapsRemaining(lastFuelLevel, averageUsage),
    [lastFuelLevel, averageUsage],
  );

  const averageToAdd = useMemo(
    () => averageUsage * raceLapsRemaining,
    [averageUsage, raceLapsRemaining],
  );

  const averageFuelUsageProps = useMemo<
    FuelCalculatorUIProps["averageFuelUsage"]
  >(
    () => ({
      usage: averageUsage,
      remaining: averageLapsRemaining,
      toAdd: averageToAdd,
      unit: fuelUnit,
    }),
    [averageUsage, averageLapsRemaining, averageToAdd, fuelUnit],
  );

  const lastLapLapsRemaining = useMemo(
    () => lapsRemaining(lastFuelLevel, lastLapUsage),
    [lastLapUsage, lastFuelLevel],
  );

  const lastLapToAdd = useMemo(
    () => lastLapUsage * raceLapsRemaining,
    [lastLapUsage, raceLapsRemaining],
  );

  const lastFuelUsageProps = useMemo<FuelCalculatorUIProps["lastFuelUsage"]>(
    () => ({
      usage: lastLapUsage,
      remaining: lastLapLapsRemaining,
      toAdd: lastLapToAdd,
      unit: fuelUnit,
    }),
    [lastLapUsage, lastLapLapsRemaining, lastLapToAdd, fuelUnit],
  );

  const customLapsRemaining = useMemo(
    () => lapsRemaining(lastFuelLevel, customUsage),
    [lastFuelLevel, customUsage],
  );

  const customLapsToAdd = useMemo(
    () => Math.max(0, customUsage * raceLapsRemaining - lastFuelLevel),
    [customUsage, raceLapsRemaining],
  );

  const customFuelUsageProps = useMemo<
    FuelCalculatorUIProps["customFuelUsage"]
  >(
    () => ({
      remaining: customLapsRemaining,
      toAdd: customLapsToAdd,
      unit: fuelUnit,
    }),
    [customLapsRemaining, customLapsToAdd, fuelUnit],
  );

  return (
    <FuelCalculatorUI
      fuelLevel={lastFuelLevel.toFixed(2)}
      fuelUnit={fuelUnit}
      raceLapsRemaining={raceLapsRemaining}
      averageFuelUsage={averageFuelUsageProps}
      lastFuelUsage={lastFuelUsageProps}
      customFuelUsage={customFuelUsageProps}
      onCustomUsageChange={setCustomUsage}
    />
  );
};

export default FuelCalculator;
