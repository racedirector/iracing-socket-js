import React, { PropsWithChildren, useMemo } from "react";
import { useAppSelector } from "src/app/hooks";
import {
  selectFuel,
  selectLastLapUsage,
  selectAverageUsage,
  selectAverageFuelLapsRemaining,
  selectLastLapFuelLapsRemaining,
} from "src/features/fuelSlice";
import { FuelContextType, getFuelContext } from "./context";

export interface FuelProviderProps {}

export const FuelProvider: React.FC<PropsWithChildren<FuelProviderProps>> = ({
  children,
}) => {
  const FuelContext = getFuelContext();
  const state = useAppSelector(selectFuel);
  const lastUsage = useAppSelector(selectLastLapUsage);
  const lastFuelLapsRemaining = useAppSelector(selectLastLapFuelLapsRemaining);
  const averageUsage = useAppSelector(selectAverageUsage);
  const averageFuelLapsRemaining = useAppSelector(
    selectAverageFuelLapsRemaining,
  );
  const averageRefuelAmount = 10; //useAverageRefuelAmount();
  const lastRefuelAmount = 10; //useLastRefuelAmount();

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
