import React, { useMemo } from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { Drivers as DriversUI } from "src/components/Drivers";

export interface DriversProps {}

export const Drivers: React.FC<DriversProps> = () => {
  const { data: { DriverInfo: { Drivers = [] } = {} } = {} } =
    useIRacingContext();

  const drivers = useMemo(
    () =>
      Drivers.map((driver) => ({
        userName: driver.UserName,
        teamName: driver.TeamName,
        teamIncidentCount: driver.TeamIncidentCount,
        carNumber: driver.CarNumber,
        currentDriverIncidentCount: driver.CurDriverIncidentCount,
      })),
    [Drivers],
  );

  return <DriversUI drivers={drivers} />;
};
