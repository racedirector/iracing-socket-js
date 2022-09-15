import {
  Camera as CameraType,
  CameraGroup as CameraGroupType,
  CameraInfo as CameraInfoType,
} from "@racedirector/iracing-socket-js";
import React from "react";

interface CameraProps extends Pick<CameraType, "CameraName"> {}

const Camera: React.FC<CameraProps> = ({ CameraName: name }) => (
  <div>
    <p>{`Name: ${name}`}</p>
  </div>
);

interface CameraGroupProps extends CameraGroupType {}

const CameraGroup: React.FC<CameraGroupProps> = ({
  GroupName: groupName,
  Cameras: cameras,
}) => (
  <>
    <p>{`Group: ${groupName}`}</p>
    {cameras.map((props) => (
      <Camera {...props} />
    ))}
  </>
);

export interface CamerasProps extends Partial<CameraInfoType> {}

export const Cameras: React.FC<CamerasProps> = ({ Groups: groups = [] }) => {
  return (
    <div>
      <h1>Cameras</h1>
      {groups.map((props) => (
        <CameraGroup {...props} />
      ))}
    </div>
  );
};

export default Cameras;
