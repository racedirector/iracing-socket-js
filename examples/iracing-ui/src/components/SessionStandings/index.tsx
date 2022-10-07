import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from "@chakra-ui/react";
import React from "react";

interface StandingsRowProps {
  position: number;
  // gain: number;
  classPosition: number;
  carNumber: number;
  name: string;
  gap: string;
  interval: string;

  isMulticlass: boolean;
}

const StandingsRow: React.FC<StandingsRowProps> = ({
  position,
  // gain,
  classPosition,
  carNumber,
  name,
  gap,
  interval,
  isMulticlass,
}) => (
  <Tr>
    <Td>{position}</Td>
    {/* <Td>{gain}</Td> */}
    {isMulticlass && <Td>{classPosition}</Td>}
    <Td>{`#${carNumber}`}</Td>
    <Td>{name}</Td>
    <Td>{gap}</Td>
    <Td>{interval}</Td>
  </Tr>
);

export interface SessionStandingsProps {
  isMulticlass: boolean;
  standings: Omit<StandingsRowProps, "isMulticlass">[];
}

export const SessionStandings: React.FC<SessionStandingsProps> = ({
  isMulticlass,
  standings,
}) => (
  <TableContainer>
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Position</Th>
          <Th>Gain</Th>
          {isMulticlass && <Th>Class Position</Th>}
          <Th>Car Number</Th>
          <Th>Name</Th>
          <Th>Gap</Th>
          <Th>Interval</Th>
        </Tr>
      </Thead>
      <Tbody>
        {standings.map((props, index) => (
          <StandingsRow
            key={`${props.carNumber}-${index}`}
            {...props}
            isMulticlass={isMulticlass}
          />
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default SessionStandings;
