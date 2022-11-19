import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import {
  Driver,
  selectActiveDriversByCarIndex,
} from "@racedirector/iracing-socket-js";
import store, { RootState } from "src/app/store";
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
  },
});

const driversSelectors = driversAdapter.getSelectors<RootState>(
  (state) => state.drivers,
);

export const allDrivers = driversSelectors.selectAll(store.getState());
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

  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState.iRacing,
    driversFilters,
  );

  const existingDriverIds = driversSelectors.selectIds(currentState);

  const currentActiveDriverIds = Object.values(currentActiveDrivers).map(
    ({ UserID }) => UserID,
  );

  console.log("Currently tracking:", existingDriverIds);
  console.log("Currently active:", currentActiveDriverIds);

  const newIds = currentActiveDriverIds.filter(
    (id) => existingDriverIds.indexOf(id) < 0,
  );

  console.log("New driver IDs:", newIds);
};

startAppListening({
  predicate: activeDriversDidChangePredicate,
  effect: checkDriverUpdateEffect,
});

export default driversSlice.reducer;
