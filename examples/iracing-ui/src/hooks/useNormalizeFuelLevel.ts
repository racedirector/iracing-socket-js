import { useMemo, useCallback } from "react";
import {
  useCurrentDriver,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";

export type UseNormalizeFuelLevelHookResult = (fuel: number) => number;
export type UseNormalizeFuelLevelHook = () => UseNormalizeFuelLevelHookResult;

export const useNormalizeFuelLevel: UseNormalizeFuelLevelHook = () => {
  const {
    data: {
      DisplayUnits: displayUnits = undefined,
      DriverInfo: { DriverCarFuelKgPerLtr: kgPerLiterConstant = 0.75 } = {},
    } = {},
  } = useIRacingContext();

  const currentDriver = useCurrentDriver();

  const useKg = useMemo(() => {
    return currentDriver
      ? [33, 39, 71, 77].includes(currentDriver.CarID)
      : false;
  }, [currentDriver]);

  const useImpGal = useMemo(() => {
    return currentDriver ? [25, 42].includes(currentDriver.CarID) : false;
  }, [currentDriver]);

  return useCallback(
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
};

export default useNormalizeFuelLevel;
