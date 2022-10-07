import { useContext, createContext } from "react";

export interface FuelContextType {
  fuelLevel: number;
  fuelCalculation: number;
  averageUsage: number;
  averageUsageUnit: string;
  pastUsage: number[];
  lapStarted: boolean;
}

export const FuelContext = createContext<FuelContextType>(null);
FuelContext.displayName = "FuelContext";

export const useFuelContext = () => useContext(FuelContext);
