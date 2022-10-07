import {
  useDriversByCarIndex,
  useIRacingContext,
  Flags,
} from "@racedirector/iracing-socket-js";
import React, {
  PropsWithChildren,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { FuelContext, FuelContextType } from "./context";

enum FuelActionType {
  SET_FUEL_LEVEL = "SET_FUEL_LEVEL",
  SET_FUEL_CALC = "SET_FUEL_CALC",
  ADD_USAGE = "ADD_USAGE",
  SET_LAP_STARTED = "SET_LAP_STARTED",
}

interface FuelActionBase<T> {
  type: FuelActionType;
  payload: T;
}

interface SetFuelLevelAction extends FuelActionBase<number> {
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

type FuelAction =
  | AddUsageFuelAction
  | SetLapStartedAction
  | SetFuelLevelAction
  | SetFuelLevelCalculationAction;

type FuelState = FuelContextType;

const initialState: FuelState = {
  fuelLevel: 0,
  fuelCalculation: 0,
  averageUsage: -1,
  averageUsageUnit: null,
  pastUsage: [],
  lapStarted: false,
};

const reducer: Reducer<FuelState, FuelAction> = (state, action) => {
  switch (action.type) {
    case FuelActionType.ADD_USAGE:
      return { ...state, pastUsage: [...state.pastUsage, action.payload] };
    case FuelActionType.SET_FUEL_LEVEL:
      return { ...state, fuelLevel: action.payload };
    case FuelActionType.SET_LAP_STARTED:
      return { ...state, lapStarted: action.payload };
    case FuelActionType.SET_FUEL_CALC:
      return { ...state, fuelCalculation: action.payload };
    default:
      throw new Error("Invalid action!");
  }
};

export interface FuelProviderProps {
  numberOfPastLaps: number;
}

export const FuelProvider: React.FC<PropsWithChildren<FuelProviderProps>> = ({
  numberOfPastLaps = 7,
  children = null,
}) => {
  const {
    data: {
      SessionFlags: sessionFlags = -1,
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
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentDriver = useMemo(
    () => driverIndex?.[driverCarIndex],
    [driverIndex, driverCarIndex],
  );

  const useKg = useMemo(() => {
    return [33, 39, 71, 77].includes(currentDriver.CarID);
  }, [currentDriver.CarID]);

  const useImpGal = useMemo(() => {
    return [25, 42].includes(currentDriver.CarID);
  }, [currentDriver.CarID]);

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
      dispatch({
        type: FuelActionType.SET_LAP_STARTED,
        payload: false,
      });

      return false;
    }

    return true;
  }, [sessionFlags]);

  const updateFuelCalculation = useCallback((displayOnly = false) => {
    const distancePercentage = LapDistPct !== -1 ? LapDistPct : null;

    if (IsOnTrack) {
      if (lastFuelLevel && curFuelLevel > lastFuelLevel) {
        lapStarted = false;
      }

      if (distancePercentage && distancePercentage !== -1) {
        if (
          distancePercentage < 0.1 &&
          lastDistance &&
          lastDistance > 0.9 &&
          checkFlagsCallback()
        ) {
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!nextFuelLevel || nextFuelLevel < 0) {
      return;
    }

    const fuel = normalizeFuelLevel(nextFuelLevel);
    dispatch({ type: FuelActionType.SET_FUEL_LEVEL, payload: fuel });
  }, [nextFuelLevel, normalizeFuelLevel, state.fuelLevel]);

  // Check flags every time the callback is regenerated
  useEffect(() => {
    checkFlagsCallback();
  }, [checkFlagsCallback]);

  // Update the state for fuel calculations based on on track status
  useEffect(() => {
    if (IsOnTrack) {
      updateFuelCalculation();
    } else {
    }
  }, [IsOnTrack]);

  useEffect(() => {
    updateFuelCalculation();
  }, [LapDistPct]);

  return <FuelContext.Provider value={state}></FuelContext.Provider>;
};

export default FuelProvider;
