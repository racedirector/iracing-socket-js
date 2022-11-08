import React, { useCallback } from "react";
import {
  useIRacingContext,
  useDriverForCarIndex,
  cameraSwitchNumber,
} from "@racedirector/iracing-socket-js";
import { Cameras as CamerasUI } from "src/components/Cameras";
import { useAppDispatch } from "src/app/hooks";

export interface CamerasProps {}

export const Cameras: React.FC<CamerasProps> = () => {
  const dispatch = useAppDispatch();
  const {
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
        dispatch(
          cameraSwitchNumber({
            number: selectedDriver.CarNumber,
            cameraGroup: groupNumber,
            cameraNumber,
          }),
        );
      }
    },
    [cameraNumber, selectedDriver, dispatch],
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
