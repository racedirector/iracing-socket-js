import { useEffect, useState } from "react";
import { keyBy, isEqual } from "lodash";
import { iRacingSocketOptions } from "../../core";
import { Driver } from "../../types";
import { useIRacingSocket } from "./useIRacingSocket";

export const useDriverIndex: (
  options?: iRacingSocketOptions,
) => Record<string, Driver> = (socketOptions = null) => {
  const { data: { DriverInfo: { Drivers: drivers = [] } = {} } = {} } =
    useIRacingSocket(socketOptions);
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
