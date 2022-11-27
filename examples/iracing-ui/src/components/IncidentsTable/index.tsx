import React from "react";
import {
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tr,
  Th,
  Thead,
  Td,
  Tbody,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Flags } from "@racedirector/iracing-socket-js";

interface IncidentRowProps {
  id: string;
  driverId: number;
  carIndex: number;
  trackPercentage: number;
  flags: Flags;
  sessionTime: number;
  value: number;
}
export interface IncidentsTableProps {
  incidents: IncidentRowProps[];
  onPressIncident?: (incidentId: string) => void;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  incidents = [],
  onPressIncident = () => {},
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
            <Th>Replay</Th>
          </Tr>
        </Thead>

        <Tbody>
          {incidents.map(
            ({
              id,
              driverId,
              carIndex,
              trackPercentage,
              value,
              flags,
              sessionTime,
            }) => (
              <Tr>
                <Td>{driverId}</Td>
                <Td>{carIndex}</Td>
                <Td>{trackPercentage}</Td>
                <Td>{value}</Td>
                <Td>{`0x${flags.toString(16)}`}</Td>
                <Td>{sessionTime}</Td>
                <Td>
                  <IconButton
                    aria-label="View replay"
                    colorScheme="green"
                    icon={<ViewIcon />}
                    onClick={() => onPressIncident(id)}
                  />
                </Td>
              </Tr>
            ),
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default IncidentsTable;
