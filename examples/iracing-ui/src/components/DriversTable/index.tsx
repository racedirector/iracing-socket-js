import {
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { Driver } from "@racedirector/iracing-socket-js";
import React from "react";

interface DriverRowProps extends Driver {
  onPress: () => void;
}

const DriverRow: React.FC<DriverRowProps> = ({
  UserName: userName,
  CarNumber: carNumber,
  CurDriverIncidentCount: currentDriverIncidentCount,
  TeamIncidentCount: teamIncidentCount,
  onPress,
}) => (
  <Tr onClick={onPress}>
    <Td>{`#${carNumber}`}</Td>
    <Td>{userName}</Td>
    <Td isNumeric>{currentDriverIncidentCount}</Td>
    <Td isNumeric>{teamIncidentCount}</Td>
  </Tr>
);

export interface DriversProps {
  drivers: Omit<DriverRowProps, "onPress">[];
  onPressDriver: (carIndex: number) => void;
}

export const Drivers: React.FC<DriversProps> = ({
  drivers = [],
  onPressDriver,
}) => (
  <TableContainer>
    <Table variant="striped">
      <TableCaption>Drivers Currently In Cars/On Track</TableCaption>
      <Thead>
        <Tr>
          <Th>Car number</Th>
          <Th>Driver name</Th>
          <Th isNumeric>Driver incidents</Th>
          <Th isNumeric>Team incidents</Th>
        </Tr>
      </Thead>
      <Tbody>
        {drivers.map((props) => (
          <DriverRow
            {...props}
            onPress={() => onPressDriver(props.CarNumberRaw)}
          />
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default Drivers;
