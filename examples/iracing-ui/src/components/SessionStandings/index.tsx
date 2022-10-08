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

  classColor: number;

  onPress: React.MouseEventHandler<HTMLTableRowElement>;
}

const StandingsRow: React.FC<StandingsRowProps> = ({
  position,
  // gain,
  classPosition,
  classColor = 0xffda59,
  carNumber,
  name,
  gap,
  interval,
  isMulticlass,
  onPress = () => {},
}) => (
  <Tr onClick={onPress}>
    <Td>{position}</Td>
    {/* <Td>{gain}</Td> */}
    {isMulticlass && (
      <Td style={{ backgroundColor: `#${classColor.toString(16)}` }}>
        {classPosition + 1}
      </Td>
    )}
    <Td>{`#${carNumber}`}</Td>
    <Td>{name}</Td>
    <Td>{gap}</Td>
    <Td>{interval}</Td>
  </Tr>
);

export interface SessionStandingsProps {
  isMulticlass: boolean;
  onPress: (carNumber: number) => void;
  standings: Omit<StandingsRowProps, "isMulticlass" | "onPress">[];
}

export const SessionStandings: React.FC<SessionStandingsProps> = ({
  isMulticlass,
  onPress,
  standings,
}) => (
  <TableContainer>
    <Table variant="striped">
      <Thead>
        <Tr>
          <Th>Position</Th>
          {/* <Th>Gain</Th> */}
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
            onPress={(event) => {
              onPress(props.carNumber);
            }}
          />
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

export default SessionStandings;
