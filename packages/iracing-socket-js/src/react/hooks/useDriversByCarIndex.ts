import { useMemo } from "react";
import { chain } from "lodash";
import { useIRacingContext } from "../context";
import { Driver } from "../../types";

export interface UseDriversByCarIndexProps {
  includeAI: boolean;
  includePaceCar: boolean;
}

export const useDriversByCarIndex: (
  props?: Partial<UseDriversByCarIndexProps>,
) => Record<number, Driver> = ({
  includeAI = true,
  includePaceCar = true,
} = {}) => {
  const { data: { DriverInfo: { Drivers: results = [] } = {} } = {} } =
    useIRacingContext();

  const index = useMemo(
    () =>
      chain(results)
        .keyBy("CarIdx")
        .filter(({ CarIsPaceCar, CarIsAI }) => {
          if (!includeAI && CarIsAI) {
            return false;
          } else if (!includePaceCar && CarIsPaceCar) {
            return false;
          }

          return true;
        })
        .valueOf(),
    [includeAI, includePaceCar, results],
  );

  return index;
};

export default useDriversByCarIndex;
