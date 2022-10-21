import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/app/store";
import { isEmpty } from "lodash";

export interface FuelState {
  pastUsage: number[];

  lapStarted: boolean;
  lapChanged: boolean;

  lastFuelLevel: number;
}

const initialState: FuelState = {
  pastUsage: [10],
  lapStarted: false,
  lapChanged: false,
  lastFuelLevel: 75.672,
};

interface AddUsagePayload {
  usage: number;
  fuelLevel: number;
}

const MAX_FUEL_COUNT = 7;

export const fuelSlice = createSlice({
  name: "fuel",
  initialState,
  reducers: {
    lapStarted: (state, action: PayloadAction<number>) => {
      state.lapChanged = state.lapStarted;

      // If the lap isn't previously started, track the fuel level.
      // !!!: This situation occurs on the first run of a lap
      if (!state.lapStarted) {
        state.lastFuelLevel = action.payload;
      }

      state.lapStarted = true;
    },
    resetLap: (state) => {
      state.lapStarted = false;
    },
    addUsage: (state, action: PayloadAction<AddUsagePayload>) => {
      const { usage, fuelLevel } = action.payload;
      state.lapChanged = false;
      state.lastFuelLevel = fuelLevel;
      state.pastUsage.push(usage);

      // Trim the array down to MAX_FUEL_COUNT...
      while (state.pastUsage.length > MAX_FUEL_COUNT) state.pastUsage.shift();
    },
    setFuelLevel: (state, action: PayloadAction<number>) => {
      state.lastFuelLevel = action.payload;
    },
  },
});

export const { lapStarted, resetLap, addUsage, setFuelLevel } =
  fuelSlice.actions;

export const fuelLapsRemaining = (usage: number, fuelLevel: number) => {
  return usage <= 0 ? 0 : fuelLevel / usage;
};

export const refuelAmount = (
  raceLapsRemaining: number,
  usage: number,
  fuelLevel: number,
  buffer = 0.5,
) => {
  if (raceLapsRemaining <= 0) {
    return 0;
  }

  const fuelLaps = fuelLapsRemaining(usage, fuelLevel);
  const fuelToEndOfRace = (raceLapsRemaining - fuelLaps) * usage;
  return fuelToEndOfRace >= 0 ? fuelToEndOfRace + buffer : 0;
};

export const selectFuel = (state: RootState) => state.fuel;

export const selectLastFuelLevel = (state: RootState) =>
  state.fuel.lastFuelLevel;

export const selectLastLapUsage = (state: RootState) =>
  state.fuel.pastUsage?.[state.fuel.pastUsage.length - 1] || 0;

export const selectLastLapFuelLapsRemaining = (state: RootState) => {
  const usage = selectLastLapUsage(state);
  return fuelLapsRemaining(usage, state.fuel.lastFuelLevel);
};

export const selectLastLapRefuelAmount =
  (lapsRemaining: number) => (state: RootState) => {
    const usage = selectLastLapUsage(state);
    const fuelLevel = selectLastFuelLevel(state);
    return refuelAmount(lapsRemaining, usage, fuelLevel);
  };

export const selectAverageUsage = (state: RootState) => {
  const fuelState = state.fuel;
  if (isEmpty(fuelState.pastUsage)) {
    return 0;
  }

  const usage = [...fuelState.pastUsage].sort();
  const averageUsageSource = usage.length >= 3 ? usage.slice(1, -1) : usage;
  const totalFuelUsage = averageUsageSource.reduce(
    (aggregateFuelUsage, fuelUsage) => aggregateFuelUsage + fuelUsage,
  );

  return totalFuelUsage / averageUsageSource.length;
};

export const selectAverageFuelLapsRemaining = (state: RootState) => {
  const usage = selectAverageUsage(state);
  return fuelLapsRemaining(usage, state.fuel.lastFuelLevel);
};

export const selectAverageRefuelAmount =
  (lapsRemaining: number) => (state: RootState) => {
    const usage = selectAverageUsage(state);
    const fuelLevel = selectLastFuelLevel(state);
    return refuelAmount(lapsRemaining, usage, fuelLevel);
  };

export default fuelSlice.reducer;
