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
import React from "react";

interface DriverRowProps {
  userName: string;
  carNumber: string;
  carNumberRaw: number;
  incidentCount: number;
  teamIncidentCount: number;
  position: number;
  classPosition: number;
  qualifyTime?: number;
  bestLapTime?: number;
  lastLapTime?: number;
  onPress: () => void;
}

const DriverRow: React.FC<DriverRowProps> = ({
  userName,
  carNumber,
  incidentCount,
  teamIncidentCount,
  qualifyTime = 0,
  bestLapTime = 0,
  lastLapTime = 0,
  position = 0,
  classPosition = 0,
  onPress,
}) => (
  <Tr onClick={onPress}>
    <Td>{position}</Td>
    <Td>{classPosition}</Td>
    <Td>{`#${carNumber}`}</Td>
    <Td>{userName}</Td>
    <Td>{bestLapTime}</Td>
    <Td>{lastLapTime}</Td>
    <Td isNumeric>{incidentCount}</Td>
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
          <Th>Position</Th>
          <Th>Class</Th>
          <Th>Car number</Th>
          <Th>Driver name</Th>
          <Th>Best Lap Time</Th>
          <Th>Last Lap Time</Th>
          <Th isNumeric>Driver incidents</Th>
          <Th isNumeric>Team incidents</Th>
          <Th>Flags</Th>
        </Tr>
      </Thead>
      <Tbody>
        {drivers.map((props) => (
          <DriverRow
            {...props}
            onPress={() => onPressDriver(props.carNumberRaw)}
          />
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default Drivers;
