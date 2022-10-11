import { useContext, createContext } from "react";

export interface FuelContextType {
  fuelLevel: string;
  fuelCalculation: number;
  averageUsage: number;
  averageUsageUnit: string;
  pastUsage: number[];

  lapStarted: boolean;
  lastLapDistance: number;
  lastFuelLevel: number;
}

export const FuelContext = createContext<FuelContextType>(null);
FuelContext.displayName = "FuelContext";

export const useFuelContext = () => useContext(FuelContext);
