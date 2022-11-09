import React, { useMemo } from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import {
  CameraGroup,
  CameraInfo as CameraInfoType,
} from "@racedirector/iracing-socket-js";

export interface CameraSelectionMenuProps extends Partial<CameraInfoType> {
  groups: CameraGroup[];
  selectedGroupNumber: number;
  onCameraSelect: (groupNumber: number) => void;
}

export const CameraSelectionMenu: React.FC<CameraSelectionMenuProps> = ({
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
  );
};

export default CameraSelectionMenu;
