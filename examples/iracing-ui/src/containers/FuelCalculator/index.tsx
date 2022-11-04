import React, { useMemo } from "react";
import { useCurrentDriver } from "@racedirector/iracing-socket-js";
import {
  FuelCalculator as FuelCalculatorUI,
  FuelCalculatorProps as FuelCalculatorUIProps,
} from "../../components/FuelCalculator";
import { useFuelUnit } from "../../hooks/useFuelUnit";
import { useFuel } from "../../contexts/Fuel";
import { useRaceLength } from "../../contexts/RaceLength/hooks";
import { RaceLength } from "../RaceLength";

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
  const { CarClassID = -1 } = useCurrentDriver() || {};

  const lapsRemainingForCurrentDriver = useMemo(
    () => lapsRemaining?.[CarClassID] || 0,
    [lapsRemaining, CarClassID],
  );

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
    <>
      <RaceLength />
      <FuelCalculatorUI
        fuelLevel={lastFuelLevel.toFixed(2)}
        fuelUnit={fuelUnit}
        raceLaps={raceLaps}
        raceLapsRemaining={lapsRemainingForCurrentDriver}
        averageFuelUsage={averageFuelUsageProps}
        lastFuelUsage={lastFuelUsageProps}
      />
    </>
  );
};

export default FuelCalculator;
