import {
  createListenerMiddleware,
  addListener,
  AnyListenerPredicate,
  ListenerEffect,
  AnyAction,
} from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "./store";
import {
  actionCreatorForTrackLocationChange,
  flagsChanged,
  playerIsInGarageChanged,
  playerIsOnTrackChanged,
  playerOnPitRoadChanged,
  playerTrackLocationChanged,
  sessionStateChanged,
} from "./actions";
import {
  flagsDidChangePredicate,
  playerTrackSurfaceDidChangePredicate,
  playerIsOnTrackDidChangePredicate,
  playerIsInGarageDidChangePredicate,
  activeDriversDidChangePredicate,
  playerIsOnPitRoadDidChangePredicate,
  sessionStateDidChangePredicate,
  selectSessionEventData,
  carsTrackSurfaceDidChangePredicate,
} from "@racedirector/iracing-socket-js";
import { checkDriverUpdateEffect } from "../features/driversSlice";
import { checkDriverSwapEffect } from "src/features/driverSwapSlice";

export const listenerMiddleware = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

export type AppListenerPredicate = AnyListenerPredicate<RootState>;
export type AppListenerEffect = ListenerEffect<
  AnyAction,
  RootState,
  AppDispatch
>;

// Listener for flag changes

export const flagsDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const { sessionNumber, sessionTime } = selectSessionEventData(
    currentState.iRacing,
  );
  const currentSessionFlags = currentState.iRacing.data?.SessionFlags;
  const previousSessionFlags =
    listenerApi.getOriginalState().iRacing.data?.SessionFlags;

  listenerApi.dispatch(
    flagsChanged({
      currentFlags: currentSessionFlags,
      previousFlags: previousSessionFlags,
      sessionNumber,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: (action, currentState, previousState) =>
    flagsDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: flagsDidChangeEffect,
});

// Listener for player track surface changes
export const playerTrackSurfaceDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const { sessionNumber, sessionTime } = selectSessionEventData(
    currentState.iRacing,
  );
  const currentTrackLocation = currentState.iRacing.data?.PlayerTrackSurface;
  const previousTrackLocation =
    listenerApi.getOriginalState().iRacing.data?.PlayerTrackSurface;

  listenerApi.dispatch(
    playerTrackLocationChanged({
      currentTrackLocation,
      previousTrackLocation,
      sessionNumber,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: (action, currentState, previousState) =>
    playerTrackSurfaceDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: playerTrackSurfaceDidChangeEffect,
});

// Listener for player is on track changes
export const playerIsOnTrackDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const { sessionNumber, sessionTime } = selectSessionEventData(
    currentState.iRacing,
  );
  const currentIsOnTrack = currentState.iRacing.data?.IsOnTrack;
  const previousIsOnTrack =
    listenerApi.getOriginalState().iRacing.data?.IsOnTrack;

  listenerApi.dispatch(
    playerIsOnTrackChanged({
      currentIsOnTrack,
      previousIsOnTrack,
      sessionNumber,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: (action, currentState, previousState) =>
    playerIsOnTrackDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: playerIsOnTrackDidChangeEffect,
});

// Listener for player is in garage changes
export const playerIsInGarageDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  listenerApi.dispatch(
    playerIsInGarageChanged({
      currentIsInGarage: listenerApi.getState().iRacing.data?.IsInGarage,
      previousIsInGarage:
        listenerApi.getOriginalState().iRacing.data?.IsInGarage,
    }),
  );
};

startAppListening({
  predicate: (action, currentState, previousState) =>
    playerIsInGarageDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: playerIsInGarageDidChangeEffect,
});

export const playerIsOnPitRoadDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const { sessionNumber, sessionTime } = selectSessionEventData(
    currentState.iRacing,
  );
  const currentOnPitRoad = currentState.iRacing.data?.OnPitRoad;
  const previousOnPitRoad =
    listenerApi.getOriginalState().iRacing.data?.OnPitRoad;

  listenerApi.dispatch(
    playerOnPitRoadChanged({
      currentOnPitRoad,
      previousOnPitRoad,
      sessionNumber,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: (action, currentState, previousState) =>
    playerIsOnPitRoadDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: playerIsOnPitRoadDidChangeEffect,
});

// Listener for session state changes
startAppListening({
  predicate: (action, currentState, previousState) =>
    sessionStateDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: (_action, listenerApi) => {
    const currentState = listenerApi.getState();
    const { sessionNumber, sessionTime } = selectSessionEventData(
      currentState.iRacing,
    );

    listenerApi.dispatch(
      sessionStateChanged({
        sessionNumber,
        sessionTime,
        currentSessionState: currentState.iRacing.data?.SessionState,
        previousSessionState:
          listenerApi.getOriginalState().iRacing.data?.SessionState,
      }),
    );
  },
});

// Updates that should happen when the driver changes.
startAppListening({
  predicate: (action, currentState, previousState) =>
    activeDriversDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: (action, listener) => {
    // Update the drivers index
    checkDriverUpdateEffect(action, listener);
    // Check for driver swaps
    checkDriverSwapEffect(action, listener);
    // checkIncidentsEffect(action, listener);
  },
});

startAppListening({
  predicate: (action, currentState, previousState) =>
    carsTrackSurfaceDidChangePredicate(
      action,
      currentState.iRacing,
      previousState.iRacing,
    ),
  effect: (_action, listenerApi) => {
    const currentState = listenerApi.getState();
    const previousState = listenerApi.getOriginalState();

    const { sessionNumber, sessionTime } = selectSessionEventData(
      currentState.iRacing,
    );

    const currentTrackSurfaces = currentState.iRacing.data?.CarIdxTrackSurface;
    const previousTrackSurfaces =
      previousState.iRacing.data?.CarIdxTrackSurface;

    for (let carIndex = 0; carIndex < currentTrackSurfaces.length; carIndex++) {
      const currentTrackSurface = currentTrackSurfaces[carIndex];
      const previousTrackSurface = previousTrackSurfaces[carIndex];

      const actionCreator = actionCreatorForTrackLocationChange(
        previousTrackSurface,
        currentTrackSurface,
      );

      if (actionCreator) {
        listenerApi.dispatch(
          actionCreator({
            carIndex,
            sessionNumber,
            sessionTime,
            lapPercentage:
              currentState.iRacing.data?.CarIdxLapDistPct[carIndex],
          }),
        );
      }
    }
  },
});
