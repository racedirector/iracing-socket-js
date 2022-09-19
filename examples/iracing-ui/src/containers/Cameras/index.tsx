import React, { useCallback } from "react";
import {
  iRacingSocketCommands,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { Cameras as CamerasUI } from "src/components/Cameras";
import { useDriverForCarIdx } from "src/hooks/useDriverForCarIdx";

export interface CamerasProps {}

export const Cameras: React.FC<CamerasProps> = () => {
  const {
    sendCommand,
    data: { CameraInfo: cameraInfo = {}, CamCarIdx: focusIndex = -1 } = {},
  } = useIRacingContext();
  const selectedDriver = useDriverForCarIdx(focusIndex);

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
