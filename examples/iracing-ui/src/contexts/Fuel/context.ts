import { getContext, getContextKey } from "../../utils";
import { FuelState } from "../../features/fuelSlice";

export interface FuelContextType extends FuelState {
  // The fuel to add based on the average usage
  averageFuelCalculation: number;
  // The average usage
  averageUsage: number;
  // Fuel laps remaining based on the average usage
  averageFuelLapsRemaining: number;

  // The fuel to add based on the average usage
  lastFuelCalculation: number;
  // The last usage
  lastUsage: number;
  // Fuel laps remaining based on the last usage
  lastFuelLapsRemaining: number;
}

const DEFAULT_CONTEXT: FuelContextType = {
  averageUsage: 0,
  averageFuelCalculation: 0,
  averageFuelLapsRemaining: 0,

  lastUsage: 0,
  lastFuelCalculation: 0,
  lastFuelLapsRemaining: 0,

  pastUsage: [],

  lapStarted: false,
  lapChanged: false,

  lastFuelLevel: 0,
};

const contextKey = getContextKey("__IRACING_FUEL_CONTEXT__");

export function getFuelContext(): React.Context<FuelContextType> {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "FuelContext";
  return context;
}

export { getFuelContext as resetFuelContext };
