import React from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { Drivers as DriversUI } from "src/components/Drivers";

export interface DriversProps {}

export const Drivers: React.FC<DriversProps> = () => {
  const { data: { DriverInfo: { Drivers: drivers = [] } = {} } = {} } =
    useIRacingContext();

  return <DriversUI drivers={drivers} />;
};
