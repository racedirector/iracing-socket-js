import React from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { Cameras as CamerasUI } from "src/components/Cameras";

export interface CamerasProps {}

export const Cameras: React.FC<CamerasProps> = () => {
  const { data: { CameraInfo: cameraInfo = {} } = {} } = useIRacingContext();
  return <CamerasUI {...cameraInfo} />;
};

export default Cameras;
