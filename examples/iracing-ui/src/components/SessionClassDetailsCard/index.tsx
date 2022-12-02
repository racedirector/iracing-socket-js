import React, { useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Stat,
  StatGroup,
  StatLabel,
  StatArrow,
  StatHelpText,
  Text,
  StatNumber,
} from "@chakra-ui/react";
import moment from "moment";
import styles from "./styles";
import { normalizeLapDuration } from "../../utils";

export interface DeltaLabelProps {
  timeDelta: number;
}

export const DeltaLabel: React.FC<DeltaLabelProps> = ({ timeDelta }) => {
  const isGain = Math.sign(timeDelta) === -1;

  return (
    <StatHelpText>
      <StatArrow type={isGain ? "increase" : "decrease"} />
      {Math.abs(timeDelta)}
    </StatHelpText>
  );
};

export interface SessionClassDetailsCardProps {
  color: string;
  className: string;
  strengthOfField: number;
  lapsCompleted: number;
  totalLaps: number;
  estimated: boolean;

  fastestLap?: number;
  // A signed number indicating the delta
  fastestLapDelta?: number;
  leaderPaceCount?: number;
  leaderPace?: number;
  // A signed number indicating the delta
  leaderPaceDelta?: number;
  fieldPaceCount?: number;
  fieldPace?: number;
  // A signed number indicating the delta
  fieldPaceDelta?: number;
  expectedLapTime?: number;
  expectedLapTimeDelta?: number;
}

export const SessionClassDetailsCard: React.FC<
  SessionClassDetailsCardProps
> = ({
  className,
  strengthOfField,
  lapsCompleted,
  totalLaps,
  color,
  fastestLap = -1,
  fastestLapDelta = undefined,
  leaderPaceCount,
  leaderPace = -1,
  leaderPaceDelta = undefined,
  fieldPaceCount,
  fieldPace = -1,
  fieldPaceDelta = undefined,
  expectedLapTime = -1,
  expectedLapTimeDelta = undefined,
}) => {
  const normalizedFastestLap = useMemo(() => {
    return fastestLap > 0
      ? normalizeLapDuration(moment.duration(fastestLap, "seconds"))
      : null;
  }, [fastestLap]);

  const normalizedLeaderPace = useMemo(() => {
    return leaderPace > 0
      ? normalizeLapDuration(moment.duration(leaderPace, "seconds"))
      : null;
  }, [leaderPace]);

  const normalizedFieldPace = useMemo(() => {
    return fieldPace > 0
      ? normalizeLapDuration(moment.duration(fieldPace, "seconds"))
      : null;
  }, [fieldPace]);

  const normalizedExpectedPace = useMemo(() => {
    return expectedLapTime > 0
      ? normalizeLapDuration(moment.duration(expectedLapTime, "seconds"))
      : null;
  }, [expectedLapTime]);

  return (
    <Box flex={1} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Flex style={styles.header} bg={color}>
        <Heading size="md">{className}</Heading>
        <Spacer />
        <Text size="xs">{`SoF: ${strengthOfField.toFixed(1)}k`}</Text>
      </Flex>

      <Flex style={styles.contentContainer}>
        <Text>{`Lap ${lapsCompleted} of ${totalLaps}`}</Text>
        <Text>{`${totalLaps - lapsCompleted + 1} to go`}</Text>

        <StatGroup>
          {normalizedFastestLap && (
            <Stat>
              <StatLabel>Fastest Lap</StatLabel>
              <StatNumber>{normalizedFastestLap}</StatNumber>
              {fastestLapDelta && <DeltaLabel timeDelta={fastestLapDelta} />}
            </Stat>
          )}
          {normalizedExpectedPace && (
            <Stat>
              <StatLabel>Expected</StatLabel>
              <StatNumber>{normalizedExpectedPace}</StatNumber>
              {expectedLapTimeDelta && (
                <DeltaLabel timeDelta={expectedLapTimeDelta} />
              )}
            </Stat>
          )}
          {normalizedLeaderPace && (
            <Stat>
              <StatLabel>{`Leader Pace${
                leaderPaceCount ? ` (Last ${leaderPaceCount})` : ""
              }`}</StatLabel>
              <StatNumber>{normalizedLeaderPace}</StatNumber>
              {leaderPaceDelta && <DeltaLabel timeDelta={leaderPaceDelta} />}
            </Stat>
          )}
          {normalizedFieldPace && (
            <Stat>
              <StatLabel>{`Field Pace${
                fieldPaceCount ? ` (Last ${fieldPaceCount})` : ""
              }`}</StatLabel>
              <StatNumber>{normalizedFieldPace}</StatNumber>
              {fieldPaceDelta && <DeltaLabel timeDelta={fieldPaceDelta} />}
            </Stat>
          )}
        </StatGroup>
      </Flex>
    </Box>
  );
};
