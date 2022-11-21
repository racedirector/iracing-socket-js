import {
  createAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Driver,
  selectActiveDriversByCarIndex,
  selectActiveDriversByUserId,
} from "@racedirector/iracing-socket-js";
import { RootState } from "src/app/store";
import { AppListenerEffect } from "src/app/middleware";
import { groupBy, isEmpty } from "lodash";

const driversAdapter = createEntityAdapter<Driver>({
  selectId: (driver) => driver.UserID,
});

interface DriverSwapPayload {
  from?: number;
  to: number;
  sessionTime: number;
  carIndex: number;
}

const driverSwap = createAction<DriverSwapPayload>("drivers/driverSwap");

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

export const { driverAdded, driversAdded, driversUpsert, driversReceived } =
  driversSlice.actions;

export const allDrivers = driversSelectors.selectAll;
export const driverById = (state: RootState, driverId: number) =>
  driversSelectors.selectById(state, driverId);

export const driversByTeamId = (state: RootState) => {
  const allDrivers = driversSelectors.selectAll(state);
  return groupBy(allDrivers, "TeamID");
};

const driversFilters = {
  includePaceCar: false,
  includeAI: true,
  includeSpectators: false,
};

export const checkDriverUpdateEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();

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

  if (!isEmpty(newDrivers)) {
    listenerApi.dispatch(driversUpsert(newDrivers));
  }
};

export const checkDriverSwapEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const previousState = listenerApi.getOriginalState();

  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState.iRacing,
    driversFilters,
  );

  const previousActiveDrivers = selectActiveDriversByCarIndex(
    previousState.iRacing,
    driversFilters,
  );

  Object.entries(currentActiveDrivers).forEach(([carIndex, driver]) => {
    // Get the existing driver, if any
    const existingDriver = previousActiveDrivers?.[carIndex] || undefined;

    // A driver swap is considered if the existing driver exists and the current driver
    // UserID does not match, or if the existing driver doesn't exist (new entry?)
    const isDriverSwap = existingDriver
      ? driver.UserID !== existingDriver.UserID
      : true;

    if (isDriverSwap) {
      listenerApi.dispatch(
        driverSwap({
          from: existingDriver?.UserID,
          to: driver.UserID,
          sessionTime: currentState.iRacing.data?.SessionTime,
          carIndex: driver.CarIdx,
        }),
      );
    }
  });
};

export default driversSlice.reducer;
