// Predicates for redux listener middleware

import { AnyListenerPredicate } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { PitServiceStatus, SessionState, TrackLocation } from "../types";
import { selectActiveDriversByCarIndex } from "./selectors";
import { IRacingSocketState } from "./state";

type IRacingSocketListenerPredicate = AnyListenerPredicate<IRacingSocketState>;

/**
 * Indicates whether the `OnPitRoad` flag changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `OnPitRoad` did change.
 */
export const playerIsOnPitRoadDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentOnPitRoad = currentState.data?.OnPitRoad || false;
    const previousOnPitRoad = previousState.data?.OnPitRoad || false;
    return currentOnPitRoad !== previousOnPitRoad;
  };

/**
 * Indicates whether the `SessionTick` changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `SessionTick` did change.
 */
export const sessionTickDidChangePredicate: IRacingSocketListenerPredicate = (
  _action,
  currentState,
  previousState,
) => currentState.data?.SessionTick !== previousState.data?.SessionTick;

/**
 * Indicates whether the `SessionFlags` flag changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `SessionFlags` did change.
 */
export const flagsDidChangePredicate: IRacingSocketListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentFlags = currentState.data?.SessionFlags || 0x0;
  const previousFlags = previousState.data?.SessionFlags || 0x0;
  return currentFlags !== previousFlags;
};

/**
 * Indicates whether the `PlayerTrackSurface` changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `PlayerTrackSurface` did change.
 */
export const playerTrackSurfaceDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentTrackLocation =
      currentState.data?.PlayerTrackSurface || TrackLocation.NotInWorld;
    const previousTrackLocation =
      previousState.data?.PlayerTrackSurface || TrackLocation.NotInWorld;
    return currentTrackLocation !== previousTrackLocation;
  };

/**
 * Indicates whether the `IsOnTrack` flag changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `IsOnTrack` did change.
 */
export const playerIsOnTrackDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentIsOnTrack = currentState.data?.IsOnTrack || false;
    const previousIsOnTrack = previousState.data?.IsOnTrack || false;
    return currentIsOnTrack !== previousIsOnTrack;
  };

/**
 * Indicates whether the `IsInGarage` flag changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `IsInGarage` did change.
 */
export const playerIsInGarageDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentIsInGarage = currentState.data?.IsInGarage || false;
    const previousIsInGarage = previousState.data?.IsInGarage || false;
    return currentIsInGarage !== previousIsInGarage;
  };

/**
 * Indicates whether the `SessionState` value changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `SessionState` did change.
 */
export const sessionStateDidChangePredicate: IRacingSocketListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentSessionState =
    currentState.data?.SessionState || SessionState.Invalid;
  const previousSessionState =
    previousState.data?.SessionState || SessionState.Invalid;
  return currentSessionState !== previousSessionState;
};

const activeDriverFilters = {
  includeAI: true,
  includeSpectators: false,
  includePaceCar: false,
};

/**
 * Indicates whether the active drivers array in the iRacing data did change.
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not the active drivers list did change.
 */
export const activeDriversDidChangePredicate: IRacingSocketListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentActiveDrivers = selectActiveDriversByCarIndex(
    currentState,
    activeDriverFilters,
  );

  const previousActiveDrivers = selectActiveDriversByCarIndex(
    previousState,
    activeDriverFilters,
  );

  return !isEqual(currentActiveDrivers, previousActiveDrivers);
};

/**
 * Indicates whether the `PitSvFlags` flag changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `PitSvFlags` did change.
 */
export const playerCarPitServiceFlagsDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentServiceStatus = currentState.data?.PitSvFlags || 0x0;
    const previousServiceStatus = previousState.data?.PitSvFlags || 0x0;

    return currentServiceStatus !== previousServiceStatus;
  };

/**
 * Indicates whether the `PlayerCarPitSvStatus` flag changes in the iRacing data
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `PlayerCarPitSvStatus` did change.
 */
export const playerCarPitServiceStatusDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentServiceStatus =
      currentState.data?.PlayerCarPitSvStatus || PitServiceStatus.None;
    const previousServiceStatus =
      previousState.data?.PlayerCarPitSvStatus || PitServiceStatus.None;

    return currentServiceStatus !== previousServiceStatus;
  };

/**
 * Indicates whether the cars have transitioned on to pit road. This includes loading in, towing, etc.
 * For more detail on transitions, `CarIdxTrackSurfaceLocation` should be observed.
 * @param _action unused
 * @param currentState IRacingSocketState representing the next state in the store
 * @param previousState IRacingSocketState representing the previous state in the store
 * @returns A boolean indicating whether or not `OnPitRoad` did change.
 */
export const carsOnPitRoadDidChangePredicate: IRacingSocketListenerPredicate = (
  _action,
  currentState,
  previousState,
) => {
  const currentCarsOnPitRoad = currentState.data?.CarIdxOnPitRoad;
  const previousCarsOnPitRoad = previousState.data?.CarIdxOnPitRoad;
  return !isEqual(currentCarsOnPitRoad, previousCarsOnPitRoad);
};

export const carsTrackSurfaceDidChangePredicate: IRacingSocketListenerPredicate =
  (_action, currentState, previousState) => {
    const currentTrackSurfaceSource =
      currentState.data?.CarIdxTrackSurface || [];
    const previousTrackSurfaceSource =
      previousState.data?.CarIdxTrackSurface || [];

    return !isEqual(currentTrackSurfaceSource, previousTrackSurfaceSource);
  };
