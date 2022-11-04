import { AnyListenerPredicate, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Driver,
  selectActiveDriversByCarIndex,
} from "@racedirector/iracing-socket-js";
import {
  activeDriversDidChangePredicate,
  AppListenerEffect,
  startAppListening,
} from "src/app/middleware";
import { RootState } from "src/app/store";

interface Team {
  teamName: string;
  teamId: number;
  roster: Record<string, Driver>;
}

export interface TeamState {
  [carIndex: string]: Team;
}

const initialState: TeamState = {};

interface DriverSwapPayload {
  from?: Driver;
  to: Driver;
}

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    driverSwap: (state, action: PayloadAction<DriverSwapPayload>) => {
      const { from, to } = action.payload;
      if (!from) {
        state[to.CarIdx] = {
          teamId: to.TeamID,
          teamName: to.TeamName,
          roster: {
            [to.UserID]: to,
          },
        };
      } else {
        const existingTeam = state[from.CarIdx];
        existingTeam.roster = { ...existingTeam.roster, [to.UserID]: to };
      }
    },
  },
});

export const { driverSwap } = teamSlice.actions;

const incidentFilters = {
  includePaceCar: false,
  includeAI: true,
  includeSpectators: false,
};

const driverSwapPredicate: AnyListenerPredicate<RootState> = (
  action,
  currentState,
  previousState,
) =>
  activeDriversDidChangePredicate(action, currentState, previousState) &&
  currentState.iRacing.data?.WeekendInfo?.TeamRacing > 0;

const checkDriverChangeEffect: AppListenerEffect = (_action, listenerApi) => {
  const currentState = listenerApi.getState();
  const previousState = listenerApi.getOriginalState();

  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState.iRacing,
    incidentFilters,
  );
  const previousActiveDrivers = selectActiveDriversByCarIndex(
    previousState.iRacing,
    incidentFilters,
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
          from: existingDriver,
          to: driver,
        }),
      );
    }
  });
};

startAppListening({
  predicate: driverSwapPredicate,
  effect: checkDriverChangeEffect,
});

export default teamSlice.reducer;
