import React, { useEffect, useMemo } from "react";
import {
  Accordion,
  Button,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  Camera as CameraType,
  CameraGroup,
  CameraGroup as CameraGroupType,
  CameraInfo as CameraInfoType,
} from "@racedirector/iracing-socket-js";

export interface CamerasProps extends Partial<CameraInfoType> {
  groups: CameraGroup[];
  selectedGroupNumber: number;
  onCameraSelect: (groupNumber: number) => void;
}

export const Cameras: React.FC<CamerasProps> = ({
  groups = [],
  selectedGroupNumber = -1,
  onCameraSelect,
}) => {
  const selectedGroup = useMemo(() => {
    if (selectedGroupNumber >= 0) {
      return groups?.[selectedGroupNumber - 1];
    }

    return null;
  }, [selectedGroupNumber, groups]);

  return (
    <>
      <h1>Cameras</h1>
      <Menu>
        <MenuButton as={Button}>
          {selectedGroup ? selectedGroup.GroupName : "Cameras"}
        </MenuButton>
        <MenuList>
          {groups.map(({ GroupNum, GroupName }) => (
            <MenuItem onClick={() => onCameraSelect(GroupNum)}>
              {GroupName}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default Cameras;
