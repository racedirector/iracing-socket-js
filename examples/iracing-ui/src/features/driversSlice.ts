import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import {
  Driver,
  selectActiveDriversByUserId,
} from "@racedirector/iracing-socket-js";
import { RootState } from "src/app/store";
import {
  activeDriversDidChangePredicate,
  AppListenerEffect,
  startAppListening,
} from "src/app/middleware";

const driversAdapter = createEntityAdapter<Driver>({
  selectId: (driver) => driver.UserID,
});

const driversSlice = createSlice({
  name: "drivers",
  initialState: driversAdapter.getInitialState(),
  reducers: {
    // Adds a single driver
    driverAdded: driversAdapter.addOne,
    // Adds many drivers
    driversAdded: driversAdapter.addMany,
    // Sets all drivers
    driversReceived: driversAdapter.setAll,
    driversUpsert: driversAdapter.upsertMany,
  },
});

const driversSelectors = driversAdapter.getSelectors<RootState>(
  (state) => state.drivers,
);

export const { driverAdded, driversUpsert, driversReceived } =
  driversSlice.actions;

export const allDrivers = driversSelectors.selectAll;
export const driverById = (state: RootState, driverId: number) =>
  driversSelectors.selectById(state, driverId);

const driversFilters = {
  includePaceCar: false,
  includeAI: true,
  includeSpectators: false,
};

const checkDriverUpdateEffect: AppListenerEffect = (_action, listenerApi) => {
  const currentState = listenerApi.getState();
  // const previousState = listenerApi.getOriginalState();

  const currentActiveDrivers = selectActiveDriversByUserId(
    currentState.iRacing,
    driversFilters,
  );

  const existingDriverIds = driversSelectors.selectIds(currentState);

  const currentActiveDriverIds = Object.keys(currentActiveDrivers);

  const newIds = currentActiveDriverIds.filter(
    (id) => existingDriverIds.indexOf(id) < 0,
  );

  const newDriverEntries = Object.entries(currentActiveDrivers).filter(
    ([driverId]) => newIds.includes(driverId),
  );

  const newDrivers = Object.fromEntries(newDriverEntries);

  if (newDrivers) {
    listenerApi.dispatch(driversUpsert(newDrivers));
  }
};

startAppListening({
  predicate: activeDriversDidChangePredicate,
  effect: checkDriverUpdateEffect,
});

export default driversSlice.reducer;
