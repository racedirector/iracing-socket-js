import { createContext } from "react";

export interface FuelContextType {
  // The fuel to add
  fuelCalculation: number;
  // The average usage
  averageUsage: number;
  // Usage last lap
  lastLapUsage: number;
  // The last 5 laps
  pastUsage: number[];

  lapStarted: boolean;
  lapChanged: boolean;

  lastFuelLevel: number;
}

const DEFAULT_CONTEXT: FuelContextType = {
  fuelCalculation: 0,
  averageUsage: 1.32,
  lastLapUsage: 1.36,
  pastUsage: [1.3, 1.36],

  lapStarted: false,
  lapChanged: false,

  lastFuelLevel: 3.5,
};

// To make sure Apollo Client doesn't create more than one React context
// (which can lead to problems like having an Apollo Client instance added
// in one context, then attempting to retrieve it from another different
// context), a single Apollo context is created and tracked in global state.
const contextKey =
  typeof Symbol === "function" && typeof Symbol.for === "function"
    ? Symbol.for("__IRACING_FUEL_CONTEXT__")
    : "__IRACING_FUEL_CONTEXT__";

export function getFuelContext(): React.Context<FuelContextType> {
  let context = (createContext as any)[
    contextKey
  ] as React.Context<FuelContextType>;
  if (!context) {
    Object.defineProperty(createContext, contextKey, {
      value: (context = createContext<FuelContextType>(DEFAULT_CONTEXT)),
      enumerable: false,
      writable: false,
      configurable: true,
    });
    context.displayName = "FuelContext";
  }
  return context;
}

export { getFuelContext as resetFuelContext };
