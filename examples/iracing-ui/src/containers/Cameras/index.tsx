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
    data: {
      CameraInfo: { Groups: groups = [] } = {},
      CamCarIdx: focusIndex = -1,
      CamCameraNumber: cameraNumber,
      CamGroupNumber: groupNumber,
    } = {},
  } = useIRacingContext();

  const selectedDriver = useDriverForCarIndex(focusIndex);

  const onCameraSelectCallback = useCallback(
    (groupNumber) => {
      if (selectedDriver) {
        sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
          selectedDriver.CarNumber,
          groupNumber,
          cameraNumber,
        ]);
      }
    },
    [cameraNumber, selectedDriver, sendCommand],
  );

  return (
    <CamerasUI
      groups={groups}
      selectedGroupNumber={groupNumber}
      onCameraSelect={(groupNumber) => onCameraSelectCallback(groupNumber)}
    />
  );
};

export default Cameras;
