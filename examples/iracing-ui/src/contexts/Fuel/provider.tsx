import {
  useIRacingContext,
  Flags,
  TrackLocation,
  SessionState,
} from "@racedirector/iracing-socket-js";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import usePrevious from "../../hooks/usePrevious";
import { getFuelContext } from "./context";
import { reducer, FuelActionType } from "../../reducers/fuel";
import useRaceLength from "src/hooks/useRaceLength";

const flagsResetLap = (flags: Flags) => {
  return (
    flags &
    (Flags.RandomWaving |
      Flags.GreenHeld |
      Flags.Serviceable |
      Flags.CautionWaving |
      Flags.Furled)
  );
};

export interface FuelProviderProps {}

export const FuelProvider: React.FC<PropsWithChildren<FuelProviderProps>> = ({
  children,
}) => {
  const FuelContext = getFuelContext();
  const initialState = useContext(FuelContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log("Next state:", state);
  }, [state]);

  const {
    data: {
      FuelLevel: nextFuelLevel = -1,
      IsOnTrack: isOnTrack,
      LapDistPct: lapDistancePercent = -1,
      OnPitRoad: isOnPitRoad,
      PlayerTrackSurface: playerTrackSurface,
      SessionFlags: sessionFlags = -1,
      SessionState: sessionState = SessionState.Invalid,
    } = {},
  } = useIRacingContext();
  const previousFuelLevel = usePrevious(nextFuelLevel);
  const previousLapDistancePercentage = usePrevious(lapDistancePercent);
  const previousPlayerTrackSurface = usePrevious(playerTrackSurface);

  // Check flags every time the flag changes
  useEffect(() => {
    if (!sessionFlags || sessionFlags === -1) {
      return;
    }

    if (flagsResetLap(sessionFlags)) {
      dispatch({ type: FuelActionType.RESET_LAP });
    }
  }, [sessionFlags]);

  // Update off track state
  useEffect(() => {
    if (!isOnTrack) {
      console.log("Off track");
      dispatch({ type: FuelActionType.RESET_LAP });
    }
  }, [isOnTrack]);

  // Update pit road state
  useEffect(() => {
    if (isOnPitRoad) {
      dispatch({ type: FuelActionType.RESET_LAP });
    }
  }, [isOnPitRoad]);

  useEffect(() => {
    if (
      nextFuelLevel > -1 &&
      previousFuelLevel &&
      nextFuelLevel > previousFuelLevel
    ) {
      console.log("Measured fuel level greater than the previous check...");
      dispatch({ type: FuelActionType.RESET_LAP });
    }
  }, [nextFuelLevel, previousFuelLevel]);

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
      console.log("Looks like we crossed the line... good luck!");
      dispatch({ type: FuelActionType.LAP_STARTED });
    }
  }, [
    previousLapDistancePercentage,
    lapDistancePercent,
    isOnTrack,
    sessionFlags,
  ]);

  // If the track surface changes, check if we should reset...
  useEffect(() => {
    if (
      typeof playerTrackSurface === "undefined" ||
      typeof previousPlayerTrackSurface === "undefined" ||
      playerTrackSurface === previousPlayerTrackSurface
    ) {
      return;
    }

    if (
      playerTrackSurface === TrackLocation.NotInWorld ||
      (previousPlayerTrackSurface === TrackLocation.OnTrack &&
        playerTrackSurface === TrackLocation.InPitStall) ||
      (previousPlayerTrackSurface === TrackLocation.InPitStall &&
        playerTrackSurface === TrackLocation.OnTrack)
    ) {
      dispatch({ type: FuelActionType.RESET_LAP });
    }
  }, [playerTrackSurface, previousPlayerTrackSurface]);

  const trackFuelCallback = useCallback(() => {
    console.log("TrackFuelCallback!");

    const isValidLap =
      !isOnPitRoad || sessionFlags & (Flags.Caution | Flags.CautionWaving);
    const fuelUsage = state.lastFuelLevel - nextFuelLevel;

    if (
      isValidLap &&
      nextFuelLevel >= 0 &&
      state.lastFuelLevel > nextFuelLevel
    ) {
      dispatch({
        type: FuelActionType.ADD_USAGE,
        payload: { fuelUsage, currentFuelLevel: nextFuelLevel },
      });
    }
  }, [isOnPitRoad, sessionFlags, state.lastFuelLevel, nextFuelLevel]);

  useEffect(() => {
    if (state.lapChanged && sessionState === SessionState.Racing) {
      console.log("Tracking fuel usage!");
      trackFuelCallback();
    }
  }, [state.lapChanged, sessionState, trackFuelCallback]);

  return <FuelContext.Provider value={state}>{children}</FuelContext.Provider>;
};

export default FuelProvider;
