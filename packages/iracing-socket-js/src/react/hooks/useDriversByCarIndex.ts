import { useMemo } from "react";
import { chain } from "lodash";
import { useIRacingContext } from "../context";
import { Driver } from "../../types";

export const useDriversByCarIndex: () => Record<number, Driver> = () => {
  const { data: { DriverInfo: { Drivers: results = [] } = {} } = {} } =
    useIRacingContext();

  const index = useMemo(
    () => chain(results).keyBy("CarIdx").valueOf(),
    [results],
  );

  return index;
};

export default useDriversByCarIndex;
