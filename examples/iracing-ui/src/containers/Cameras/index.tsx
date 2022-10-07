import React, { useCallback } from "react";
import {
  iRacingSocketCommands,
  useIRacingContext,
  useDriverForCarIndex,
} from "@racedirector/iracing-socket-js";
import { Cameras as CamerasUI } from "src/components/Cameras";

export interface CamerasProps {}

export const Cameras: React.FC<CamerasProps> = () => {
  const {
    sendCommand,
    data: { CameraInfo: cameraInfo = {}, CamCarIdx: focusIndex = -1 } = {},
  } = useIRacingContext();
  const selectedDriver = useDriverForCarIndex(focusIndex);

  const onCameraSelectCallback = useCallback(
    (groupNumber, cameraNumber) => {
      if (selectedDriver) {
        sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
          selectedDriver.CarNumber,
          groupNumber,
          cameraNumber,
        ]);
      }
    },
    [selectedDriver, sendCommand],
  );

  return <CamerasUI {...cameraInfo} onCameraSelect={onCameraSelectCallback} />;
};

export default Cameras;
