import React, { useMemo } from "react";
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import moment from "moment";
import styles from "./styles";
import { normalizeLapDuration } from "src/utils";
import { DeltaLabel } from "../DeltaLabel";

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
        {normalizedFastestLap && (
          <>
            <Heading size="xs">Fastest Lap</Heading>
            <Text>{normalizedFastestLap.toString()}</Text>
            {fastestLapDelta && <DeltaLabel timeDelta={fastestLapDelta} />}
          </>
        )}
        {normalizedExpectedPace && (
          <>
            <Heading size="xs">Expected</Heading>
            <Text>{normalizedExpectedPace.toString()}</Text>
            {expectedLapTimeDelta && (
              <DeltaLabel timeDelta={expectedLapTimeDelta} />
            )}
          </>
        )}
        {normalizedLeaderPace && (
          <>
            <Heading size="xs">{`Leader Pace${
              leaderPaceCount ? ` (Last ${leaderPaceCount})` : ""
            }`}</Heading>
            <Text>{normalizedLeaderPace.toString()}</Text>
            {leaderPaceDelta && <DeltaLabel timeDelta={leaderPaceDelta} />}
          </>
        )}
        {normalizedFieldPace && (
          <>
            <Heading size="xs">{`Field Pace${
              fieldPaceCount ? ` (Last ${fieldPaceCount})` : ""
            }`}</Heading>
            <Text>{normalizedFieldPace.toString()}</Text>
            {fieldPaceDelta && <DeltaLabel timeDelta={fieldPaceDelta} />}
          </>
        )}
      </Flex>
    </Box>
  );
};
