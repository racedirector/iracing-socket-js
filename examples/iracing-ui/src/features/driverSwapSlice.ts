import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppListenerEffect } from "src/app/middleware";
import {
  selectActiveDriversByCarIndex,
  selectSessionEventData,
} from "@racedirector/iracing-socket-js";

interface CarIndexDriverState {
  teamName: string;
  teamID: string;
  driverIDs: number[];
  // Index by driver ID with the total drive time per driver
  driveTimeIndex: Record<string, number>;
}

export interface DriverSwapState {
  totalDriveTime: Record<number, CarIndexDriverState>;
}

const initialState: DriverSwapState = {
  totalDriveTime: {},
};

interface DriverSwapPayload {
  from?: number;
  to: number;
  teamId: number;
  sessionNumber: number;
  sessionTime: number;
  carIndex: number;
}

const driverSwapSlice = createSlice({
  name: "driverSwap",
  initialState,
  reducers: {
    driverSwap: (state, payload: PayloadAction<DriverSwapPayload>) => {
      console.log(
        "There was a driver swap or something and we should figure out how to structure the data!",
      );
    },
  },
});

export const { driverSwap } = driverSwapSlice.actions;

const driversFilters = {
  includePaceCar: false,
  includeAI: true,
  includeSpectators: false,
};

export const checkDriverSwapEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  // Get the current state, drivers, and session data from the listener.
  const currentState = listenerApi.getState();
  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState.iRacing,
    driversFilters,
  );

  const { sessionNumber, sessionTime } = selectSessionEventData(
    currentState.iRacing,
  );

  // Get the previous state, drivers, and session data from the listener.
  const previousState = listenerApi.getOriginalState();
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
          teamId: driver.TeamID,
          sessionNumber,
          sessionTime,
          carIndex: driver.CarIdx,
        }),
      );
    }
  });
};

export const checkDriverStintLength: AppListenerEffect = () => {};

export default driverSwapSlice.reducer;
