import React from "react";
import {
  Table,
  TableCaption,
  TableContainer,
  Tr,
  Th,
  Thead,
  Td,
  Tbody,
} from "@chakra-ui/react";
import { Flags } from "@racedirector/iracing-socket-js";

interface IncidentRowProps {
  driverId: number;
  carIndex: number;
  trackPercentage: number;
  flags: Flags;
  sessionTime: number;
  value: number;
  onPress: () => void;
}

const IncidentRow: React.FC<IncidentRowProps> = ({
  driverId,
  carIndex,
  trackPercentage,
  flags,
  sessionTime,
  value,
  onPress,
}) => {
  return (
    <Tr onClick={onPress}>
      <Td>{driverId}</Td>
      <Td>{carIndex}</Td>
      <Td>{trackPercentage}</Td>
      <Td>{value}</Td>
      <Td>{`0x${flags.toString(16)}`}</Td>
      <Td>{sessionTime}</Td>
    </Tr>
  );
};

export interface IncidentsTableProps {
  incidents: Omit<IncidentRowProps, "onPress">[];
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  incidents = [],
}) => {
  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>
          Incidents detected from iRacing Drivers data
        </TableCaption>
        <Thead>
          <Tr>
            <Th>Driver ID</Th>
            <Th>Car Index</Th>
            <Th>Track %</Th>
            <Th>Value</Th>
            <Th>Flags</Th>
            <Th>Session Time</Th>
          </Tr>
        </Thead>

        <Tbody>
          {incidents.map((props) => (
            <IncidentRow
              {...props}
              onPress={() => console.log("Pressed the incident", props)}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default IncidentsTable;
