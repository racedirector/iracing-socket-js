import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface FuelState {
  pastUsage: number[];

  lapStarted: boolean;
  lapChanged: boolean;

  lastFuelLevel: number;
}

const initialState: FuelState = {
  pastUsage: [],
  lapStarted: false,
  lapChanged: false,
  lastFuelLevel: 0,
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

export const selectPastUsage = (state: RootState) => state.fuel.pastUsage || [];

export const selectLastLapFuelLapsRemaining = createSelector(
  selectLastLapUsage,
  selectLastFuelLevel,
  (usage, lastFuelLevel) => fuelLapsRemaining(usage, lastFuelLevel),
);

export const selectAverageUsage = createSelector(
  selectPastUsage,
  (pastUsage) => {
    const sortedUsage = [...pastUsage].sort();
    const averageUsageSource =
      sortedUsage.length >= 3 ? sortedUsage.slice(1, -1) : sortedUsage;

    return (
      averageUsageSource.reduce(
        (aggregateFuelUsage, fuelUsage) => aggregateFuelUsage + fuelUsage,
        0,
      ) / averageUsageSource.length
    );
  },
);

export const selectAverageFuelLapsRemaining = createSelector(
  selectAverageUsage,
  selectLastFuelLevel,
  (averageUsage, lastFuelLevel) =>
    fuelLapsRemaining(averageUsage, lastFuelLevel),
);

export const selectLastLapRefuelAmount = createSelector(
  [
    selectLastLapUsage,
    selectLastFuelLevel,
    (_state, lapsRemaining: number) => lapsRemaining,
  ],
  (usage, fuelLevel, lapsRemaining) =>
    refuelAmount(lapsRemaining, usage, fuelLevel),
);

export const selectAverageRefuelAmount = createSelector(
  [
    selectAverageUsage,
    selectLastFuelLevel,
    (_state, lapsRemaining: number) => lapsRemaining,
  ],
  (usage, fuelLevel, lapsRemaining) =>
    refuelAmount(lapsRemaining, usage, fuelLevel),
);

export default fuelSlice.reducer;
