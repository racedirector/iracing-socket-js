import React, { useMemo } from "react";
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import moment from "moment";
import styles from "./styles";
import { normalizeLapTime } from "src/utils";

export interface SessionClassDetailsCardProps {
  color: string;
  className: string;
  strengthOfField: number;
  lapsCompleted: number;
  totalLaps: number;
  estimated: boolean;

  fastestLap?: number;
  leaderPaceCount?: number;
  leaderPace?: number;
  fieldPaceCount?: number;
  fieldPace?: number;
  expectedLapTime?: number;

  // TODO: Deltas?
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
  leaderPaceCount,
  leaderPace = -1,
  fieldPaceCount,
  fieldPace = -1,
  expectedLapTime = -1,
}) => {
  const normalizedFastestLap = useMemo(() => {
    return fastestLap > 0
      ? normalizeLapTime(moment.duration(fastestLap, "seconds"))
      : null;
  }, [fastestLap]);

  const normalizedLeaderPace = useMemo(() => {
    return leaderPace > 0
      ? normalizeLapTime(moment.duration(leaderPace, "seconds"))
      : null;
  }, [leaderPace]);

  const normalizedFieldPace = useMemo(() => {
    return fieldPace > 0
      ? normalizeLapTime(moment.duration(fieldPace, "seconds"))
      : null;
  }, [fieldPace]);

  const normalizedExpectedPace = useMemo(() => {
    return expectedLapTime > 0
      ? normalizeLapTime(moment.duration(expectedLapTime, "seconds"))
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
        {normalizedFastestLap && (
          <>
            <Heading size="xs">Fastest Lap</Heading>
            <Text>{normalizedFastestLap.toString()}</Text>
          </>
        )}
        {normalizedExpectedPace && (
          <>
            <Heading size="xs">Expected</Heading>
            <Text>{normalizedExpectedPace.toString()}</Text>
          </>
        )}
        {normalizedLeaderPace && (
          <>
            <Heading size="xs">{`Leader Pace${
              leaderPaceCount ? ` (Last ${leaderPaceCount})` : ""
            }`}</Heading>
            <Text>{normalizedLeaderPace.toString()}</Text>
          </>
        )}
        {normalizedFieldPace && (
          <>
            <Heading size="xs">{`Field Pace${
              fieldPaceCount ? ` (Last ${fieldPaceCount})` : ""
            }`}</Heading>
            <Text>{normalizedFieldPace.toString()}</Text>
          </>
        )}
      </Flex>
    </Box>
  );
};
