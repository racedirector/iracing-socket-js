import {
  useDriversByCarIndex,
  useIRacingContext,
  Flags,
  SessionState,
  TrackLocation,
} from "@racedirector/iracing-socket-js";
import React, {
  PropsWithChildren,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { FuelContext, FuelContextType } from "./context";

enum FuelActionType {
  SET_FUEL_LEVEL = "SET_FUEL_LEVEL",
  SET_FUEL_CALC = "SET_FUEL_CALC",
  ADD_USAGE = "ADD_USAGE",
  SET_LAP_STARTED = "SET_LAP_STARTED",
  OFF_TRACK = "OFF_TRACK",
  ON_PIT_ROAD = "ON_PIT_ROAD",
  RESET = "RESET",
}

interface FuelActionBase<T> {
  type: FuelActionType;
  payload: T;
}

interface SetFuelLevelAction extends FuelActionBase<string> {
  type: FuelActionType.SET_FUEL_LEVEL;
}

interface SetFuelLevelCalculationAction extends FuelActionBase<number> {
  type: FuelActionType.SET_FUEL_CALC;
}

interface AddUsageFuelAction extends FuelActionBase<number> {
  type: FuelActionType.ADD_USAGE;
}

interface SetLapStartedAction extends FuelActionBase<boolean> {
  type: FuelActionType.SET_LAP_STARTED;
}

interface ResetAction {
  type: FuelActionType.RESET;
}

interface OnPitRoadAction {
  type: FuelActionType.ON_PIT_ROAD;
}

type FuelAction =
  | AddUsageFuelAction
  | SetLapStartedAction
  | SetFuelLevelAction
  | SetFuelLevelCalculationAction
  | ResetAction
  | OnPitRoadAction;

type FuelState = FuelContextType;

const initialState: FuelState = {
  fuelLevel: "0",
  fuelCalculation: 0,
  averageUsage: -1,
  averageUsageUnit: null,
  pastUsage: [],

  lapStarted: false,
  lastLapDistance: 0,
  lastFuelLevel: 0,
};

const reducer: Reducer<FuelState, FuelAction> = (state, action) => {
  console.log("Handling action:", action);
  switch (action.type) {
    case FuelActionType.ADD_USAGE: {
      const nextPastUsage = [...state.pastUsage, action.payload];
      while (nextPastUsage.length > 7) {
        nextPastUsage.shift();
      }

      return { ...state, pastUsage: nextPastUsage };
    }
    case FuelActionType.SET_FUEL_LEVEL:
      return { ...state, fuelLevel: action.payload };
    case FuelActionType.SET_LAP_STARTED:
      return { ...state, lapStarted: action.payload };
    case FuelActionType.SET_FUEL_CALC:
      return { ...state, fuelCalculation: action.payload };
    case FuelActionType.RESET:
      return {
        ...state,
        lapStarted: false,
        lastFuelLevel: null,
        lastLapDistance: null,
      };
    case FuelActionType.ON_PIT_ROAD:
      return { ...state, lapStarted: false };
    default:
      throw new Error("Invalid action!");
  }
};

export interface FuelProviderProps {
  numberOfPastLaps?: number;
}

export const FuelProvider: React.FC<PropsWithChildren<FuelProviderProps>> = ({
  numberOfPastLaps = 7,
  children = null,
}) => {
  const {
    data: {
      LFwearR,
      PlayerTrackSurface,
      SessionFlags: sessionFlags = -1,
      SessionState: sessionState = SessionState.GetInCar,
      OnPitRoad,
      IsOnTrack,
      LapDistPct = -1,
      FuelLevel: nextFuelLevel,
      DisplayUnits: displayUnits = undefined,
      DriverInfo: {
        DriverCarIdx: driverCarIndex = -1,
        DriverCarFuelKgPerLtr: kgPerLiterConstant,
      } = {},
    } = {},
  } = useIRacingContext();
  const driverIndex = useDriversByCarIndex();
  const [previousTrackSurface, setPreviousTrackSurface] =
    useState(PlayerTrackSurface);
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentDriver = useMemo(
    () => driverIndex?.[driverCarIndex],
    [driverIndex, driverCarIndex],
  );

  const useKg = useMemo(() => {
    return currentDriver
      ? [33, 39, 71, 77].includes(currentDriver.CarID)
      : false;
  }, [currentDriver]);

  const useImpGal = useMemo(() => {
    return currentDriver ? [25, 42].includes(currentDriver.CarID) : false;
  }, [currentDriver]);

  const normalizeFuelLevel = useCallback(
    (fuel: number) => {
      let normalizedFuelLevel = fuel;
      if (useKg) {
        normalizedFuelLevel *= kgPerLiterConstant;
      }

      if (!displayUnits) {
        if (useImpGal) {
          normalizedFuelLevel *= 0.21996924829909;
        } else if (useKg) {
          normalizedFuelLevel *= 2.20462262;
        } else {
          normalizedFuelLevel *= 0.264172052;
        }
      }

      return normalizedFuelLevel;
    },
    [displayUnits, kgPerLiterConstant, useImpGal, useKg],
  );

  const checkFlagsCallback = useCallback(() => {
    if (!sessionFlags || sessionFlags === -1) {
      return false;
    } else if (
      sessionFlags &
      (Flags.RandomWaving |
        Flags.GreenHeld |
        Flags.Serviceable |
        Flags.CautionWaving |
        Flags.Furled)
    ) {
      return false;
    }

    return true;
  }, [sessionFlags]);

  // Update the fuel level state
  useEffect(() => {
    if (!nextFuelLevel || nextFuelLevel < 0) {
      return;
    }

    const fuel = normalizeFuelLevel(nextFuelLevel).toFixed(2);
    if (fuel !== state.fuelLevel) {
      console.log("Setting fuel level");
      dispatch({ type: FuelActionType.SET_FUEL_LEVEL, payload: fuel });
    }
  }, [nextFuelLevel, normalizeFuelLevel, state.fuelLevel]);

  // Check flags every time the flag changes
  useEffect(() => {
    if (
      sessionFlags &
      (Flags.RandomWaving |
        Flags.GreenHeld |
        Flags.Serviceable |
        Flags.CautionWaving |
        Flags.Furled)
    ) {
      console.log("Flags, lap false");
      dispatch({
        type: FuelActionType.SET_LAP_STARTED,
        payload: false,
      });
    }
  }, [sessionFlags]);

  // Update off track state
  useEffect(() => {
    if (!IsOnTrack) {
      console.log("Not on track, reset");
      dispatch({ type: FuelActionType.RESET });
    }
  }, [IsOnTrack]);

  // Update pit road state
  useEffect(() => {
    console.log(OnPitRoad);
    if (OnPitRoad) {
      console.log("On pit road");
      dispatch({ type: FuelActionType.ON_PIT_ROAD });
    }
  }, [OnPitRoad]);

  // If the tire wear status changes, mark the lap as not started
  useEffect(() => {
    console.log("Tire wear, lap false");
    dispatch({ type: FuelActionType.SET_LAP_STARTED, payload: false });
  }, [LFwearR]);

  // If the track surface changes, check if we should reset...
  useEffect(() => {
    if (PlayerTrackSurface !== previousTrackSurface) {
      if (
        PlayerTrackSurface === TrackLocation.NotInWorld ||
        (previousTrackSurface === TrackLocation.OnTrack &&
          PlayerTrackSurface === TrackLocation.InPitStall) ||
        (previousTrackSurface === TrackLocation.InPitStall &&
          PlayerTrackSurface === TrackLocation.OnTrack)
      ) {
        console.log("Reset track surface");
        dispatch({ type: FuelActionType.RESET });
      }

      setPreviousTrackSurface(PlayerTrackSurface);
    }
  }, [PlayerTrackSurface, previousTrackSurface]);

  // useEffect(() => {
  //   console.log("Try to update fuel calc!");
  //   const lapDistance = LapDistPct !== -1 ? LapDistPct : null;
  //   let lapChanged = false;

  //   if (IsOnTrack) {
  //     if (state.lastFuelLevel && nextFuelLevel > state.lastFuelLevel) {
  //       // TODO: Lap started
  //     }

  //     if (lapDistance && lapDistance !== -1) {
  //       if (
  //         lapDistance < 0.1 &&
  //         state.lastLapDistance > 0.9 &&
  //         checkFlagsCallback()
  //       ) {

  //       }
  //     }
  //   }

  //   // updateFuelCalculation();
  // }, [IsOnTrack, LapDistPct, checkFlagsCallback, nextFuelLevel, state.lastFuelLevel, state.lastLapDistance]);

  return <FuelContext.Provider value={state}></FuelContext.Provider>;
};

export default FuelProvider;
