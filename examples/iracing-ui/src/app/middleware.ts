import {
  createListenerMiddleware,
  addListener,
  AnyListenerPredicate,
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

const incidentFilters = {
  includeAI: true,
  includeSpectators: false,
  includePaceCar: false,
};

export const activeDriversDidChangePredicate: AnyListenerPredicate<
  RootState
> = (_action, currentState, previousState) => {
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
startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentFlags = currentState.iRacing.data?.SessionFlags || 0x0;
    const previousFlags = previousState.iRacing.data?.SessionFlags || 0x0;
    return currentFlags !== previousFlags;
  },
  effect: (_action, listenerApi) => {
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
  },
});

// Listener for player track surface changes
startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentTrackLocation =
      currentState.iRacing.data?.PlayerTrackSurface || TrackLocation.NotInWorld;
    const previousTrackLocation =
      previousState.iRacing.data?.PlayerTrackSurface ||
      TrackLocation.NotInWorld;
    return currentTrackLocation !== previousTrackLocation;
  },
  effect: (_action, listenerApi) => {
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
  },
});

// Listener for player is on track changes
startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentIsOnTrack = currentState.iRacing.data?.IsOnTrack || false;
    const previousIsOnTrack = previousState.iRacing.data?.IsOnTrack || false;
    return currentIsOnTrack !== previousIsOnTrack;
  },
  effect: (_action, listenerApi) => {
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
  },
});

// Listener for player is in garage changes
startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentIsInGarage = currentState.iRacing.data?.IsInGarage || false;
    const previousIsInGarage = previousState.iRacing.data?.IsInGarage || false;
    return currentIsInGarage !== previousIsInGarage;
  },
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      playerIsInGarageChanged({
        currentIsInGarage: listenerApi.getState().iRacing.data?.IsInGarage,
        previousIsInGarage:
          listenerApi.getOriginalState().iRacing.data?.IsInGarage,
      }),
    );
  },
});

// Listener for player is on pit road changes
startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentOnPitRoad = currentState.iRacing.data?.OnPitRoad || false;
    const previousOnPitRoad = previousState.iRacing.data?.OnPitRoad || false;
    return currentOnPitRoad !== previousOnPitRoad;
  },
  effect: (_action, listenerApi) => {
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
  },
});

// Listener for session state changes
startAppListening({
  predicate: (_action, currentState, previousState) => {
    const currentSessionState =
      currentState.iRacing.data?.SessionState || SessionState.Invalid;
    const previousSessionState =
      previousState.iRacing.data?.SessionState || SessionState.Invalid;
    return currentSessionState !== previousSessionState;
  },
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      sessionStateChanged({
        currentSessionState: listenerApi.getState().iRacing.data?.SessionState,
        previousSessionState:
          listenerApi.getOriginalState().iRacing.data?.SessionState,
      }),
    );
  },
});
