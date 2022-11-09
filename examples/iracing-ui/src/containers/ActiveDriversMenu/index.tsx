import React from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps,
  UseMenuButtonProps,
  UseMenuOptionGroupProps,
} from "@chakra-ui/react";
import {
  selectActiveDrivers,
  selectIsTeamRacing,
} from "@racedirector/iracing-socket-js";
import { createSelector } from "@reduxjs/toolkit";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface DriverMenuItemProps {
  name: string;
  value: string;
  carNumber: string;
}

const selectActiveDriverMenuOptions = createSelector(
  (state: RootState) => selectIsTeamRacing(state.iRacing),
  (state: RootState) =>
    selectActiveDrivers(state.iRacing, {
      includeAI: true,
      includePaceCar: false,
      includeSpectators: false,
    }),
  (isTeamRace, activeDrivers): DriverMenuItemProps[] =>
    activeDrivers.map((driver) => ({
      carNumber: driver.CarNumber,
      name: isTeamRace ? driver.TeamName : driver.UserName,
      value: driver.CarIdx.toString(),
    })),
);

export interface ActiveDriversMenuProps extends Omit<MenuProps, "children"> {
  title: string;
  selectionType?: UseMenuOptionGroupProps["type"];
  colorScheme?: string;
  onDriverSelect?: (carIndex: string | string[]) => void;
}

export const ActiveDriversMenu: React.FC<ActiveDriversMenuProps> = ({
  title,
  colorScheme,
  selectionType = "radio",
  onDriverSelect = () => {},
  ...props
}) => {
  const menuOptions = useAppSelector(selectActiveDriverMenuOptions);
  return (
    <Menu {...props}>
      <MenuButton
        as={Button}
        colorScheme={colorScheme}
        rightIcon={<ChevronDownIcon />}
      >
        {title}
      </MenuButton>
      <MenuList minWidth="240px">
        <MenuOptionGroup
          title="Drivers"
          type={selectionType}
          onChange={(value) => onDriverSelect(value)}
        >
          {menuOptions.map(({ name, value, carNumber }) => (
            <MenuItemOption
              key={name}
              value={value}
            >{`#${carNumber} ${name}`}</MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default ActiveDriversMenu;
