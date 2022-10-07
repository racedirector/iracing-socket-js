import { useEffect, useState } from "react";
import { Driver } from "../../types";
import { useDriversByCarIndex } from "./useDriversByCarIndex";

export const useDriverForCarIndex = (carIdx: number) => {
  const [driver, setDriver] = useState<Driver>(null);
  const driverIndex = useDriversByCarIndex();

  useEffect(() => {
    setDriver(driverIndex[carIdx]);
  }, [driverIndex, carIdx]);

  return driver;
};

export default useDriverForCarIndex;
