import React, { PropsWithChildren, useMemo } from "react";
import { useAppSelector } from "src/app/hooks";
import {
  selectFuel,
  selectLastLapUsage,
  selectAverageUsage,
  selectAverageFuelLapsRemaining,
  selectLastLapFuelLapsRemaining,
  selectAverageRefuelAmount,
  selectLastLapRefuelAmount,
} from "src/features/fuelSlice";
import { useLapsRemainingForCurrentDriver } from "../RaceLength/hooks";
import { FuelContextType, getFuelContext } from "./context";

export interface FuelProviderProps {}

export const FuelProvider: React.FC<PropsWithChildren<FuelProviderProps>> = ({
  children,
}) => {
  const FuelContext = getFuelContext();
  const state = useAppSelector(selectFuel);
  const lapsRemaining = useLapsRemainingForCurrentDriver();
  const lastUsage = useAppSelector(selectLastLapUsage);
  const lastFuelLapsRemaining = useAppSelector(selectLastLapFuelLapsRemaining);
  const averageUsage = useAppSelector(selectAverageUsage);
  const averageFuelLapsRemaining = useAppSelector(
    selectAverageFuelLapsRemaining,
  );

  const averageRefuelAmount = useAppSelector((state) =>
    selectAverageRefuelAmount(state, lapsRemaining),
  );

  const lastRefuelAmount = useAppSelector((state) =>
    selectLastLapRefuelAmount(state, lapsRemaining),
  );

  const context = useMemo<FuelContextType>(
    () => ({
      ...state,
      averageUsage,
      averageFuelLapsRemaining,
      averageFuelCalculation: averageRefuelAmount,
      lastUsage,
      lastFuelLapsRemaining,
      lastFuelCalculation: lastRefuelAmount,
    }),
    [
      state,
      averageUsage,
      averageFuelLapsRemaining,
      averageRefuelAmount,
      lastUsage,
      lastFuelLapsRemaining,
      lastRefuelAmount,
    ],
  );

  return (
    <FuelContext.Provider value={context}>{children}</FuelContext.Provider>
  );
};

export default FuelProvider;
