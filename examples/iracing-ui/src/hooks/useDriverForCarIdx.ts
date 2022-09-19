import { useEffect, useState } from "react";
import { useIRacingContext, Driver } from "@racedirector/iracing-socket-js";
import { find } from "lodash";

export const useDriverForCarIdx = (carIdx: number) => {
  const [driver, setDriver] = useState<Driver>(null);
  const { data: { DriverInfo: { Drivers: drivers = [] } = {} } = {} } =
    useIRacingContext();

  useEffect(() => {
    console.log("Selecting new driver");
    const selectedDriver = find(drivers, ({ CarIdx }) => CarIdx === carIdx);
    setDriver(selectedDriver);
  }, [drivers, carIdx]);

  return driver;
};
