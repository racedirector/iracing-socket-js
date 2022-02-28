import { useEffect, useState } from "react";
import { keyBy, isEqual } from "lodash";
import { Driver } from "../../types";
import { useIRacingSocketData } from "./useIRacingSocketData";

export const useDriverIndex: () => Record<string, Driver> = () => {
  const { DriverInfo: { Drivers: drivers = [] } = {} } = useIRacingSocketData();
  const [index, setIndex] = useState<Record<string, Driver>>({});

  useEffect(() => {
    const currentIndex = keyBy(drivers, "CarIdx");
    if (!isEqual(index, currentIndex)) {
      setIndex(currentIndex);
    }
  }, [drivers]);

  return index;
};

export default useDriverIndex;
