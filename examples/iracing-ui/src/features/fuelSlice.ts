import { createSlice, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Flags,
  SessionState,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { RootState } from "../app/store";
import {
  flagsChanged,
  playerTrackLocationChanged,
  playerIsOnTrackChanged,
  playerOnPitRoadChanged,
} from "../app/actions";
import {
  AppListenerEffect,
  AppListenerPredicate,
  startAppListening,
} from "../app/middleware";
import { selectLapsRemainingForCurrentDriver } from "./sessionPaceSlice";

export const flagsResetLap = (flags: Flags) => {
  const randomWaving = flags & Flags.RandomWaving;
  const shouldLapReset =
    flags &
    (Flags.GreenHeld | Flags.Caution | Flags.CautionWaving | Flags.Furled);
  return randomWaving && shouldLapReset;
};

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
  extraReducers: (builder) =>
    builder
      .addCase(flagsChanged, (state, action) => {
        const { currentFlags } = action.payload;
        if (flagsResetLap(currentFlags)) {
          state.lapStarted = false;
        }
      })
      .addCase(playerTrackLocationChanged, (state, action) => {
        const { currentTrackLocation, previousTrackLocation } = action.payload;

        const onTrackToPitStall =
          previousTrackLocation === TrackLocation.OnTrack &&
          currentTrackLocation === TrackLocation.InPitStall;

        const pitStallToTrack =
          previousTrackLocation === TrackLocation.InPitStall &&
          currentTrackLocation === TrackLocation.OnTrack;

        if (
          currentTrackLocation === TrackLocation.NotInWorld ||
          onTrackToPitStall ||
          pitStallToTrack
        ) {
          state.lapStarted = false;
        }
      })
      .addCase(playerIsOnTrackChanged, (state, action) => {
        const { currentIsOnTrack } = action.payload;
        if (!currentIsOnTrack) {
          state.lapStarted = false;
        }
      })
      .addCase(playerOnPitRoadChanged, (state, action) => {
        const { currentOnPitRoad } = action.payload;
        if (currentOnPitRoad) {
          state.lapStarted = false;
        }
      })
      .addDefaultCase((state) => state),
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

export const selectLiveAverageRefuelAmount = createSelector(
  [
    selectLapsRemainingForCurrentDriver,
    selectAverageUsage,
    selectLastFuelLevel,
  ],
  refuelAmount,
);

export const selectLiveLastLapRefuelAmount = createSelector(
  [
    selectLapsRemainingForCurrentDriver,
    selectLastLapUsage,
    selectLastFuelLevel,
  ],
  refuelAmount,
);

const fuelStintsRemainingHandler = (
  refuelAmount: number,
  carMaxFuelAmount = 0,
) => {
  return carMaxFuelAmount > 0 ? refuelAmount / carMaxFuelAmount : 0;
};

export const selectEstimatedAverageFuelStintsRemaining = createSelector(
  [
    selectAverageRefuelAmount,
    (state: RootState) => state.iRacing.data?.DriverInfo?.DriverCarFuelMaxLtr,
  ],
  fuelStintsRemainingHandler,
);

export const selectLiveEstimatedAverageFuelStintsRemaining = createSelector(
  [
    selectLiveAverageRefuelAmount,
    (state: RootState) => state.iRacing.data?.DriverInfo?.DriverCarFuelMaxLtr,
  ],
  fuelStintsRemainingHandler,
);

export const selectEstimatedLastFuelStintsRemaining = createSelector(
  [
    selectLastLapRefuelAmount,
    (state: RootState) => state.iRacing.data?.DriverInfo?.DriverCarFuelMaxLtr,
  ],
  fuelStintsRemainingHandler,
);

export const selectLiveEstimatedLastFuelStintsRemaining = createSelector(
  [
    selectLiveLastLapRefuelAmount,
    (state: RootState) => state.iRacing.data?.DriverInfo?.DriverCarFuelMaxLtr,
  ],
  fuelStintsRemainingHandler,
);

// Listener for when a lap starts, reports the current fuel level.
export const lapStartedPredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const isOnTrack = currentState.iRacing.data?.IsOnTrack || false;
  const sessionFlags = currentState.iRacing.data?.SessionFlags || 0x0;
  const currentLapDistancePercentage =
    currentState.iRacing.data?.LapDistPct || -1;
  const previousLapDistancePercentage =
    previousState.iRacing.data?.LapDistPct || -1;

  const lapDistanceChanged = previousLapDistancePercentage
    ? previousLapDistancePercentage !== currentLapDistancePercentage
    : false;

  const crossedTimingLine =
    currentLapDistancePercentage < 0.1 && previousLapDistancePercentage > 0.9;

  return (
    isOnTrack &&
    lapDistanceChanged &&
    crossedTimingLine &&
    !flagsResetLap(sessionFlags)
  );
};

export const lapStartedEffect: AppListenerEffect = (_action, listenerApi) => {
  const fuelLevel = listenerApi.getState().iRacing.data?.FuelLevel || -1;
  listenerApi.dispatch(lapStarted(fuelLevel));
};

startAppListening({
  predicate: lapStartedPredicate,
  effect: lapStartedEffect,
});

// Listener for when a lap changes and we're racing to update fuel usage
export const updateFuelUsagePredicate: AppListenerPredicate = (
  _action,
  currentState,
) => {
  const {
    fuel: { lapChanged, lastFuelLevel },
    iRacing: {
      data: {
        SessionState: sessionState = SessionState.Invalid,
        SessionFlags: sessionFlags = 0x0,
        OnPitRoad: isOnPitRoad = false,
        FuelLevel: currentFuelLevel = 0,
      } = {},
    },
  } = currentState;

  const isStateValid = lapChanged && sessionState === SessionState.Racing;
  const isCautionOut = sessionFlags & (Flags.Caution | Flags.CautionWaving);
  const isValidLap = !isOnPitRoad && !isCautionOut;
  const isValidFuelLevel =
    currentFuelLevel >= 0 && lastFuelLevel > currentFuelLevel;

  return isValidLap && isValidFuelLevel && isStateValid;
};

export const updateFuelUsageEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const {
    fuel: { lastFuelLevel },
    iRacing: { data: { FuelLevel: currentFuelLevel = 0 } = {} },
  } = listenerApi.getState();

  const usage = lastFuelLevel - currentFuelLevel;
  listenerApi.dispatch(addUsage({ usage, fuelLevel: currentFuelLevel }));
};

startAppListening({
  predicate: updateFuelUsagePredicate,
  effect: updateFuelUsageEffect,
});

// Listener for when the player properly enters the pit lane and enters the pit stall
export const playerEnteredPitStallPredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const isOnPitRoad = currentState.iRacing.data?.OnPitRoad || false;
  const currentTrackLocation =
    currentState.iRacing.data?.PlayerTrackSurface || TrackLocation.NotInWorld;
  const previousTrackLocation =
    previousState.iRacing.data?.PlayerTrackSurface || TrackLocation.NotInWorld;

  return (
    isOnPitRoad &&
    currentTrackLocation !== previousTrackLocation &&
    currentTrackLocation === TrackLocation.InPitStall
  );
};

export const playerEnteredPitStallEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  console.log("Player is on pit road and track location became pit stall");
  const fuelLevel = listenerApi.getState().iRacing.data?.FuelLevel || -1;
  listenerApi.dispatch(setFuelLevel(fuelLevel));
};

startAppListening({
  predicate: playerEnteredPitStallPredicate,
  effect: playerEnteredPitStallEffect,
});

// Listener for when the player is in the garage and changes the fuel level
export const playerChangedFuelLevelFromGaragePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const isInGarage = currentState.iRacing.data?.IsInGarage || false;
  const currentFuelLevel = currentState.iRacing.data?.FuelLevel || -1;
  const previousFuelLevel = previousState.iRacing.data?.FuelLevel || -1;

  return isInGarage && currentFuelLevel !== previousFuelLevel;
};

export const playerChangedFuelLevelFromGarageEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  console.log("Player is in garage and changed the fuel level");
  const fuelLevel = listenerApi.getState().iRacing.data?.FuelLevel || -1;
  listenerApi.dispatch(setFuelLevel(fuelLevel));
};

startAppListening({
  predicate: playerChangedFuelLevelFromGaragePredicate,
  effect: playerChangedFuelLevelFromGarageEffect,
});

// Listener for when the next fuel level is detected to be more than the previous
export const currentFuelLevelGreaterThanPreviousPredicate: AppListenerPredicate =
  (_action, currentState, previousState) => {
    const currentFuelLevel = currentState.iRacing.data?.FuelLevel || -1;
    const previousFuelLevel = previousState.iRacing.data?.FuelLevel || -1;

    return currentFuelLevel > -1 && currentFuelLevel > previousFuelLevel;
  };

export const currentFuelLevelGreaterThanPreviousEffect: AppListenerEffect =
  () => {
    console.log("The fuel level was detected to be more than the previous...");
  };

startAppListening({
  predicate: currentFuelLevelGreaterThanPreviousPredicate,
  effect: currentFuelLevelGreaterThanPreviousEffect,
});

export default fuelSlice.reducer;
