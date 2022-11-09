import React, { useMemo } from "react";
import { Heading } from "@chakra-ui/react";
import { RaceTime } from "@racedirector/iracing-socket-js";
import moment from "moment";

const formatSessionTime = (duration: moment.Duration) => {
  const hours = duration.hours();
  const minutes = duration.minutes();

  let result = "";
  if (hours > 0) {
    result += `${hours}h`;
  }

  if (minutes >= 0) {
    if (minutes < 10) {
      result += `0${minutes}m`;
    } else {
      result += `${minutes}m`;
    }
  }

  return result;
};

export interface SessionLengthProps {
  totalTime: RaceTime;
  timeElapsed: number;
  sessionLaps: number;
  currentLap: number;
  lapsComplete: number;
}

export const SessionLength: React.FC<SessionLengthProps> = ({
  timeElapsed,
  totalTime,
  sessionLaps,
  currentLap,
  lapsComplete,
}) => {
  const normalizedTimeElapsed = useMemo(() => {
    const timeElapsedDuration = moment.duration(timeElapsed, "seconds");
    return moment.utc(timeElapsedDuration.asMilliseconds()).format("HH:mm:ss");
  }, [timeElapsed]);

  const normalizedTotalTime = useMemo(() => {
    if (totalTime === "unlimited") {
      // TODO: This should be the estimated length
      return -1;
    } else {
      const totalTimeDuration = moment.duration(totalTime, "seconds");
      return formatSessionTime(totalTimeDuration);
    }
  }, [totalTime]);

  return (
    <>
      <Heading>{`${normalizedTimeElapsed} / ${normalizedTotalTime}`}</Heading>
      <Heading>{sessionLaps}</Heading>
      <Heading>{currentLap}</Heading>
      <Heading>{lapsComplete}</Heading>
    </>
  );
};

export default SessionLength;
