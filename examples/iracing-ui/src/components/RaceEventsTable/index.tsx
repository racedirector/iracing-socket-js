import React from "react";
import {
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RaceEvent } from "../../features/raceEventsSlice";
import { ViewIcon } from "@chakra-ui/icons";

export interface RaceEventsTableProps {
  events: RaceEvent[];
  onPressEvent?: (raceEventId: string) => void;
}

export const RaceEventsTable: React.FC<RaceEventsTableProps> = ({
  events,
  onPressEvent = () => {},
}) => {
  // TODO: Session number filter
  // TODO: Session time range filter
  // TODO: Type filter
  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>Race events</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Session Number</Th>
            <Th>Session time</Th>
            <Th>Type</Th>
            <Th>Replay</Th>
          </Tr>
        </Thead>

        <Tbody>
          {events.map(({ id, sessionNumber, sessionTime, type }) => (
            <Tr>
              <Td>{id}</Td>
              <Td>{sessionNumber}</Td>
              <Td>{sessionTime}</Td>
              <Td>{type}</Td>
              <Td>
                <IconButton
                  aria-label="View replay"
                  colorScheme="green"
                  icon={<ViewIcon />}
                  onClick={() => onPressEvent(id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
