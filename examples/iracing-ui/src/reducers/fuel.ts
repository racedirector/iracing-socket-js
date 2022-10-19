import { Reducer } from "react";
import { FuelContextType } from "../contexts/Fuel";

export enum FuelActionType {
  ADD_USAGE = "ADD_USAGE",
  LAP_STARTED = "LAP_STARTED",
  RESET_LAP = "RESET_LAP",
}

interface AddUsageFuelAction {
  type: FuelActionType.ADD_USAGE;
  payload: { fuelUsage: number; currentFuelLevel: number };
}

interface LapStartedFuelAction {
  type: FuelActionType.LAP_STARTED;
}

interface ResetLapAction {
  type: FuelActionType.RESET_LAP;
}

export type FuelAction =
  | AddUsageFuelAction
  | ResetLapAction
  | LapStartedFuelAction;

export type FuelState = FuelContextType;

const MAX_FUEL_COUNT = 7;
const AVERAGE_FUEL_COUNT = 3;

export const reducer: Reducer<FuelState, FuelAction> = (state, action) => {
  switch (action.type) {
    case FuelActionType.ADD_USAGE: {
      const { fuelUsage, currentFuelLevel } = action.payload;
      const nextPastUsage = [...state.pastUsage, fuelUsage];

      // Trim the array down to MAX_FUEL_COUNT...
      while (nextPastUsage.length > MAX_FUEL_COUNT) nextPastUsage.shift();

      // Take the middle to remove the lap with least usage and the lap
      // with the most usage for more than AVERAGE_FUEL_COUNT
      const usage = [...nextPastUsage].sort();
      const averageUsageSource =
        usage.length >= AVERAGE_FUEL_COUNT ? usage.slice(1, -1) : usage;

      const totalFuelUsage = averageUsageSource.reduce(
        (aggregateFuelUsage, fuelUsage) => aggregateFuelUsage + fuelUsage,
      );

      return {
        ...state,
        lastLapUsage: fuelUsage,
        averageUsage: totalFuelUsage / averageUsageSource.length,
        pastUsage: nextPastUsage,
        lapChanged: false,
        lastFuelLevel: currentFuelLevel,
      };
    }
    case FuelActionType.LAP_STARTED:
      return { ...state, lapStarted: true, lapChanged: state.lapStarted };
    case FuelActionType.RESET_LAP:
      return { ...state, lapStarted: false };
    default:
      return state;
  }
};
