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
  flagsChanged,
  playerIsInGarageChanged,
  playerIsOnTrackChanged,
  playerOnPitRoadChanged,
  playerTrackLocationChanged,
  sessionStateChanged,
} from "./actions";
import {
  selectActiveDriversByCarIndex,
  SessionState,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import { isEqual } from "lodash";

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

// TODO: Find a way to export this middleware below from @racedirector/iracing-socket-js

export const sessionTickDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) =>
  currentState.iRacing.data?.SessionTick !==
  previousState.iRacing.data?.SessionTick;

const incidentFilters = {
  includeAI: true,
  includeSpectators: false,
  includePaceCar: false,
};

export const activeDriversDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState.iRacing,
    incidentFilters,
  );
  const previousActiveDrivers = selectActiveDriversByCarIndex(
    previousState.iRacing,
    incidentFilters,
  );

  return !isEqual(currentActiveDrivers, previousActiveDrivers);
};

// Listener for flag changes
export const flagsDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentFlags = currentState.iRacing.data?.SessionFlags || 0x0;
  const previousFlags = previousState.iRacing.data?.SessionFlags || 0x0;
  return currentFlags !== previousFlags;
};

export const flagsDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const sessionTime = currentState.iRacing.data?.SessionTime;
  const currentSessionFlags = currentState.iRacing.data?.SessionFlags;
  const previousSessionFlags =
    listenerApi.getOriginalState().iRacing.data?.SessionFlags;

  listenerApi.dispatch(
    flagsChanged({
      currentFlags: currentSessionFlags,
      previousFlags: previousSessionFlags,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: flagsDidChangePredicate,
  effect: flagsDidChangeEffect,
});

// Listener for player track surface changes
export const playerTrackSurfaceDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentTrackLocation =
    currentState.iRacing.data?.PlayerTrackSurface || TrackLocation.NotInWorld;
  const previousTrackLocation =
    previousState.iRacing.data?.PlayerTrackSurface || TrackLocation.NotInWorld;
  return currentTrackLocation !== previousTrackLocation;
};

export const playerTrackSurfaceDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const sessionTime = currentState.iRacing.data?.SessionTime;
  const currentTrackLocation = currentState.iRacing.data?.PlayerTrackSurface;
  const previousTrackLocation =
    listenerApi.getOriginalState().iRacing.data?.PlayerTrackSurface;

  listenerApi.dispatch(
    playerTrackLocationChanged({
      currentTrackLocation,
      previousTrackLocation,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: playerTrackSurfaceDidChangePredicate,
  effect: playerTrackSurfaceDidChangeEffect,
});

// Listener for player is on track changes
export const playerIsOnTrackDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentIsOnTrack = currentState.iRacing.data?.IsOnTrack || false;
  const previousIsOnTrack = previousState.iRacing.data?.IsOnTrack || false;
  return currentIsOnTrack !== previousIsOnTrack;
};

export const playerIsOnTrackDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const sessionTime = currentState.iRacing.data?.SessionTime;
  const currentIsOnTrack = currentState.iRacing.data?.IsOnTrack;
  const previousIsOnTrack =
    listenerApi.getOriginalState().iRacing.data?.IsOnTrack;

  listenerApi.dispatch(
    playerIsOnTrackChanged({
      currentIsOnTrack,
      previousIsOnTrack,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: playerIsOnTrackDidChangePredicate,
  effect: playerIsOnTrackDidChangeEffect,
});

// Listener for player is in garage changes
export const playerIsInGarageDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentIsInGarage = currentState.iRacing.data?.IsInGarage || false;
  const previousIsInGarage = previousState.iRacing.data?.IsInGarage || false;
  return currentIsInGarage !== previousIsInGarage;
};

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
  predicate: playerIsInGarageDidChangePredicate,
  effect: playerIsInGarageDidChangeEffect,
});

// Listener for player is on pit road changes
export const playerIsOnPitRoadDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentOnPitRoad = currentState.iRacing.data?.OnPitRoad || false;
  const previousOnPitRoad = previousState.iRacing.data?.OnPitRoad || false;
  return currentOnPitRoad !== previousOnPitRoad;
};

export const playerIsOnPitRoadDidChangeEffect: AppListenerEffect = (
  _action,
  listenerApi,
) => {
  const currentState = listenerApi.getState();
  const sessionTime = currentState.iRacing.data?.SessionTime;
  const currentOnPitRoad = currentState.iRacing.data?.OnPitRoad;
  const previousOnPitRoad =
    listenerApi.getOriginalState().iRacing.data?.OnPitRoad;

  listenerApi.dispatch(
    playerOnPitRoadChanged({
      currentOnPitRoad,
      previousOnPitRoad,
      sessionTime,
    }),
  );
};

startAppListening({
  predicate: playerIsOnPitRoadDidChangePredicate,
  effect: playerIsOnPitRoadDidChangeEffect,
});

export const sessionStateDidChangePredicate: AppListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentSessionState =
    currentState.iRacing.data?.SessionState || SessionState.Invalid;
  const previousSessionState =
    previousState.iRacing.data?.SessionState || SessionState.Invalid;
  return currentSessionState !== previousSessionState;
};

// Listener for session state changes
startAppListening({
  predicate: sessionStateDidChangePredicate,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      sessionStateChanged({
        sessionTime: listenerApi.getState().iRacing.data?.SessionTime,
        currentSessionState: listenerApi.getState().iRacing.data?.SessionState,
        previousSessionState:
          listenerApi.getOriginalState().iRacing.data?.SessionState,
      }),
    );
  },
});
