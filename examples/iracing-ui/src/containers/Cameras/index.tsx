import React, { useCallback } from "react";
import { cameraSwitchNumber } from "@racedirector/iracing-socket-js";
import { useAppDispatch, useIRacingContext } from "src/app/hooks";
import { ChangeCameraMenu } from "../ChangeCameraMenu";
import ActiveDriversMenu from "../ActiveDriversMenu";

export interface CamerasProps {}

export const Cameras: React.FC<CamerasProps> = () => {
  const dispatch = useAppDispatch();
  const {
    data: {
      CamCameraNumber: cameraNumber = -1,
      CamGroupNumber: groupNumber = -1,
    } = {},
  } = useIRacingContext();
  const onDriverSelectCallback = useCallback(
    (carIndex) => {
      dispatch(
        cameraSwitchNumber({
          number: carIndex,
          cameraGroup: groupNumber,
          cameraNumber: cameraNumber,
        }),
      );
    },
    [cameraNumber, dispatch, groupNumber],
  );

  return (
    <>
      <ChangeCameraMenu />
      <ActiveDriversMenu
        title="Focused driver"
        onDriverSelect={onDriverSelectCallback}
      />
    </>
  );
};

export default Cameras;
