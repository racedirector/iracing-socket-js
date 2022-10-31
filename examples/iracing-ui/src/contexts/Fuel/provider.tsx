import {
  useIRacingContext,
  useLapResetEffect,
  Flags,
  TrackLocation,
  SessionState,
} from "@racedirector/iracing-socket-js";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  lapStarted,
  resetLap,
  addUsage,
  selectFuel,
  selectLastLapUsage,
  setFuelLevel,
  selectAverageUsage,
  selectAverageFuelLapsRemaining,
  selectLastLapFuelLapsRemaining,
  selectAverageRefuelAmount,
  selectLastLapRefuelAmount,
} from "src/features/fuelSlice";
import usePrevious from "../../hooks/usePrevious";
import { useLapsRemainingForCurrentDriver } from "../RaceLength";
import { FuelContextType, getFuelContext } from "./context";

const flagsResetLap = (flags: Flags) => {
  const randomWaving = flags & Flags.RandomWaving;
  const shouldLapReset =
    flags &
    (Flags.GreenHeld | Flags.Caution | Flags.CautionWaving | Flags.Furled);
  return randomWaving && shouldLapReset;
};

export interface FuelProviderProps {}

export const FuelProvider: React.FC<PropsWithChildren<FuelProviderProps>> = ({
  children,
}) => {
  const FuelContext = getFuelContext();
  const state = useAppSelector(selectFuel);
  const dispatch = useAppDispatch();

  const lapsRemaining = useLapsRemainingForCurrentDriver();

  const {
    data: {
      FuelLevel: nextFuelLevel = -1,
      LapDistPct: lapDistancePercent = -1,
      IsOnTrack: isOnTrack = false,
      OnPitRoad: isOnPitRoad = true,
      IsInGarage: isInGarage = false,
      PlayerTrackSurface: playerTrackSurface,
      SessionFlags: sessionFlags = -1,
      SessionState: sessionState = SessionState.Invalid,
    } = {},
  } = useIRacingContext();

  const previousFuelLevel = usePrevious(nextFuelLevel);
  const previousLapDistancePercentage = usePrevious(lapDistancePercent);
  const lastUsage = useAppSelector(selectLastLapUsage);
  const lastFuelLapsRemaining = useAppSelector(selectLastLapFuelLapsRemaining);

  const averageUsage = useAppSelector(selectAverageUsage);
  const averageFuelLapsRemaining = useAppSelector(
    selectAverageFuelLapsRemaining,
  );

  const averageRefuelAmount = useAppSelector((state) =>
    selectAverageRefuelAmount(state, lapsRemaining),
  );

  const lastRefuelAmount = useAppSelector((state) =>
    selectLastLapRefuelAmount(state, lapsRemaining),
  );

  // Check flags every time the flag changes
  useEffect(() => {
    if (!sessionFlags || sessionFlags === -1) {
      return;
    }

    if (flagsResetLap(sessionFlags)) {
      dispatch(resetLap());
    }
  }, [dispatch, sessionFlags]);

  // Update off track state
  useEffect(() => {
    if (!isOnTrack) {
      dispatch(resetLap());
    }
  }, [dispatch, isOnTrack]);

  // Update pit road state
  useEffect(() => {
    if (isOnPitRoad) {
      dispatch(resetLap());
    }
  }, [dispatch, isOnPitRoad]);

  useEffect(() => {
    if (isOnPitRoad && playerTrackSurface === TrackLocation.InPitStall) {
      dispatch(setFuelLevel(nextFuelLevel));
    }
  }, [dispatch, isOnPitRoad, playerTrackSurface, nextFuelLevel]);

  useEffect(() => {
    if (isInGarage && nextFuelLevel !== previousFuelLevel) {
      dispatch(setFuelLevel(nextFuelLevel));
    }
  }, [dispatch, isInGarage, nextFuelLevel, previousFuelLevel]);

  useEffect(() => {
    if (
      nextFuelLevel > -1 &&
      previousFuelLevel &&
      nextFuelLevel > previousFuelLevel
    ) {
      dispatch(resetLap());
    }
  }, [dispatch, nextFuelLevel, previousFuelLevel]);

  useEffect(() => {
    if (
      !previousLapDistancePercentage ||
      previousLapDistancePercentage === lapDistancePercent
    ) {
      return;
    }

    if (
      isOnTrack &&
      lapDistancePercent < 0.1 &&
      previousLapDistancePercentage > 0.9 &&
      !flagsResetLap(sessionFlags)
    ) {
      dispatch(lapStarted(nextFuelLevel));
    }
  }, [
    previousLapDistancePercentage,
    lapDistancePercent,
    nextFuelLevel,
    isOnTrack,
    sessionFlags,
    dispatch,
  ]);

  useLapResetEffect(() => {
    dispatch(resetLap());
  });

  const trackFuelCallback = useCallback(() => {
    const isCautionOut = sessionFlags & (Flags.Caution | Flags.CautionWaving);
    const isValidLap = !isOnPitRoad || !isCautionOut;

    const fuelUsage = state.lastFuelLevel - nextFuelLevel;

    if (
      isValidLap &&
      nextFuelLevel >= 0 &&
      state.lastFuelLevel > nextFuelLevel
    ) {
      dispatch(addUsage({ usage: fuelUsage, fuelLevel: nextFuelLevel }));
    }
  }, [isOnPitRoad, sessionFlags, state.lastFuelLevel, nextFuelLevel, dispatch]);

  useEffect(() => {
    if (state.lapChanged && sessionState === SessionState.Racing) {
      trackFuelCallback();
    }
  }, [state.lapChanged, sessionState, trackFuelCallback]);

  const context = useMemo<FuelContextType>(
    () => ({
      ...state,
      averageUsage,
      averageFuelLapsRemaining,
      averageFuelCalculation: averageRefuelAmount,
      lastUsage,
      lastFuelLapsRemaining,
      lastFuelCalculation: lastRefuelAmount,
    }),
    [
      state,
      averageUsage,
      averageFuelLapsRemaining,
      averageRefuelAmount,
      lastUsage,
      lastFuelLapsRemaining,
      lastRefuelAmount,
    ],
  );

  return (
    <FuelContext.Provider value={context}>{children}</FuelContext.Provider>
  );
};

export default FuelProvider;
