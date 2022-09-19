import React, { useCallback } from "react";
import {
  iRacingSocketCommands,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { Drivers as DriversUI } from "src/components/Drivers";

export interface DriversProps {}

export const Drivers: React.FC<DriversProps> = () => {
  const {
    sendCommand,
    data: {
      DriverInfo: { Drivers: drivers = [] } = {},
      CamCameraNumber: cameraNumber = -1,
      CamGroupNumber: cameraGroupNumber = -1,
    } = {},
  } = useIRacingContext();

  const onPressDriverCallback = useCallback(
    (carIndex) => {
      sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
        carIndex.toString(),
        cameraGroupNumber,
        cameraNumber,
      ]);
    },
    [cameraGroupNumber, cameraNumber, sendCommand],
  );

  return <DriversUI drivers={drivers} onPressDriver={onPressDriverCallback} />;
};
