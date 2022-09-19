import React from "react";
import {
  iRacingSocketCommands,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { Drivers as DriversUI } from "src/components/Drivers";

export interface DriversProps {}

export const Drivers: React.FC<DriversProps> = () => {
  const {
    sendCommand,
    data: { DriverInfo: { Drivers: drivers = [] } = {} } = {},
  } = useIRacingContext();

  return (
    <DriversUI
      drivers={drivers}
      onPressDriver={(carIndex) => {
        console.log("Did press car index", carIndex);
        sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
          carIndex.toString(),
          0,
          0,
        ]);
      }}
    />
  );
};
