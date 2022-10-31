import React, { useMemo } from "react";
import {
  SessionState,
  useCurrentSession,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { useRaceLength } from "src/contexts/RaceLength";
import { RaceLength as RaceLengthUI } from "../../components/RaceLength";

const useAverageLapTime = () => {
  const {
    data: {
      SessionState: sessionState = SessionState.Invalid,
      QualifyResultsInfo: { Results: qualifyResults = null } = {},
    } = {},
  } = useIRacingContext();
  const currentSession = useCurrentSession();

  if (currentSession.SessionType !== "Race") {
    return -1;
  }

  if (currentSession.ResultsLapsComplete < 2) {
    // TODO: Try to get the results from a previous session
    const results = qualifyResults;
  } else if (
    currentSession.ResultsAverageLapTime > 0 &&
    sessionState === SessionState.Racing
  ) {
    return currentSession.ResultsAverageLapTime;
  } else {
    return -1;
  }
};

// Returns the expected length of the session in seconds.
const useExpectedSessionLength = () => {
  const {
    data: {
      SessionTime: sessionTime = 0,
      SessionTimeRemain: sessionTimeRemaining = 0,
      SessionState: sessionState = SessionState.Invalid,
    } = {},
  } = useIRacingContext();
  const { sessionLength } = useRaceLength();
  const currentSession = useCurrentSession();
  const averageLapTime = useAverageLapTime();

  const currentSessionTime = useMemo(
    () => parseInt(currentSession.SessionTime) || null,
    [currentSession.SessionTime],
  );

  const currentSessionLaps = useMemo(
    () => parseInt(currentSession.SessionLaps) || null,
    [currentSession.SessionLaps],
  );

  const expectedSessionLength = useMemo(() => {
    if (currentSession.SessionType !== "Race") {
      return currentSessionTime;
    }

    const lapsRemaining =
      currentSessionLaps - Math.max(0, currentSession.ResultsLapsComplete);

    let estimatedTimeRemaining = sessionTime + lapsRemaining * averageLapTime;
    if (currentSession.ResultsLapsComplete === -1) {
      estimatedTimeRemaining += 60;
    }

    console.log("Estimated time remaining:", estimatedTimeRemaining);
    estimatedTimeRemaining = Math.ceil((estimatedTimeRemaining - 15) / 60) * 60;

    if (estimatedTimeRemaining > 0) {
      if (
        currentSessionTime > 0 &&
        estimatedTimeRemaining > currentSessionTime
      ) {
        return currentSessionTime;
      } else {
        return estimatedTimeRemaining;
      }
    }
  }, [
    currentSession.SessionType,
    currentSession.ResultsLapsComplete,
    currentSessionLaps,
    sessionTime,
    averageLapTime,
    currentSessionTime,
  ]);

  return expectedSessionLength;
};

export interface RaceLengthProps {}

export const RaceLength: React.FC<RaceLengthProps> = () => {
  const {
    data: {
      SessionTimeRemain: sessionTimeRemaining = -1,
      SessionTime: sessionTime = -1,
    } = {},
  } = useIRacingContext();

  const { sessionLength } = useRaceLength();

  const timeElapsed = useMemo(() => {
    if (sessionTimeRemaining > 0 && sessionTimeRemaining < 604800) {
      return sessionTimeRemaining;
    } else if (sessionTime > 0) {
      return sessionTime;
    }

    return null;
  }, [sessionTime, sessionTimeRemaining]);

  return <RaceLengthUI timeElapsed={timeElapsed} totalTime={sessionLength} />;
};

export default RaceLength;
