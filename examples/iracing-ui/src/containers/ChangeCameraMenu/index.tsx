import React, { useCallback } from "react";
import {
  useDriverForCarIndex,
  cameraSwitchNumber,
} from "@racedirector/iracing-socket-js";
import { CameraSelectionMenu as CamerasUI } from "src/components/CameraSelectionMenu";
import { useAppDispatch, useIRacingContext } from "src/app/hooks";

export interface ChangeCameraMenuProps {}

export const ChangeCameraMenu: React.FC<ChangeCameraMenuProps> = () => {
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
      onCameraSelect={onCameraSelectCallback}
    />
  );
};

export default ChangeCameraMenu;
