import { useEffect, useState, useMemo } from "react";
import { useIRacingContext } from "../context";
import { Driver } from "../../types";
import { useDriversByCarIndex, useDriverIndexesByClass } from "./useDrivers";

export const useDriverForCarIndex = (carIdx: number) => {
  const [driver, setDriver] = useState<Driver>();
  const driverIndex = useDriversByCarIndex();

  useEffect(() => {
    if (carIdx >= 0) {
      setDriver(driverIndex?.[carIdx]);
    }
  }, [driverIndex, carIdx]);

  return driver;
};

export const useCurrentDriver = () => {
  const { data: { DriverInfo: { DriverCarIdx = -1 } = {} } = {} } =
    useIRacingContext();
  return useDriverForCarIndex(DriverCarIdx);
};

export const useDriverForCameraIndex = () => {
  const { data: { CamCarIdx = -1 } = {} } = useIRacingContext();
  return useDriverForCarIndex(CamCarIdx);
};

type UseDriversInCurrentDriverClassHook = () => number[];

export const useDriversInCurrentDriverClass: UseDriversInCurrentDriverClassHook =
  () => {
    const { CarClassID = null } = useCurrentDriver() || {};
    const index = useDriverIndexesByClass();
    return useMemo(() => index?.[CarClassID] || [], [index, CarClassID]);
  };
