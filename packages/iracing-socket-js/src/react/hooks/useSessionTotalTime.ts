import { useCallback, useEffect, useState } from "react";
import { SessionState } from "../../types";
import { formatTime, formatTimeForSession } from "../../utilities";
import { useIRacingContext } from "../context";
import { useCurrentSession } from "./useSession";

export const useSessionTotalTime = () => {
  const [resultsLapsComplete, setResultsLapsComplete] = useState(-1);
  const [forceUseSessionTime, setForceUseSessionTime] = useState(false);
  const [sessionTimeString, setSessionTimeString] = useState(null);
  const [sessionTotalTime, setSessionTotalTime] = useState(null);
  const {
    data: {
      SessionInfo: sessionInfo,
      SessionNum: sessionNumber,
      SessionTime: sessionTime,
      SessionTimeRemain: sessionTimeRemaining,
      SessionState: sessionState,
    } = {},
  } = useIRacingContext();
  const activeSession = useCurrentSession();

  const updateSessionTotalTimeCallback = useCallback(() => {
    if (!sessionInfo || !activeSession) {
      return;
    }

    const time = parseInt(activeSession.SessionTime) || null;

    if (activeSession.SessionType !== "Race") {
      setSessionTotalTime(time > 0 ? formatTimeForSession(time) : null);
    } else {
      const raceLaps = parseInt(activeSession.SessionLaps) || null;
      if (raceLaps > 0) {
        let lapTime = null;
        if (activeSession.ResultsLapsComplete < 2) {
        } else if (
          activeSession.ResultsAverageLapTime > 0 &&
          sessionState === SessionState.Racing
        ) {
          lapTime = activeSession.ResultsAverageLapTime;
        } else {
          console.info(
            "This is some case where i should reference the last lap? Idk where that comes from",
          );
        }

        if (
          lapTime > 0 &&
          resultsLapsComplete !== activeSession.ResultsLapsComplete
        ) {
          setResultsLapsComplete(activeSession.ResultsLapsComplete);
          const lapsRemaining =
            raceLaps - Math.max(0, activeSession.ResultsLapsComplete);
          let calculatedTime = sessionTime + lapsRemaining * lapTime;

          // Add grid time
          if (activeSession.ResultsLapsComplete === -1) {
            calculatedTime += 60;
          }

          // Round race-time minus 15s up
          // ???: Idk why?
          calculatedTime = Math.ceil((calculatedTime - 15) / 60) * 60;

          if (calculatedTime > 0) {
            if (time > 0 && calculatedTime > time) {
              setSessionTotalTime(formatTimeForSession(time));
            } else {
              setSessionTotalTime(`${formatTime(calculatedTime)}`);
              setForceUseSessionTime(true);
            }
          }
        }
      } else {
        setSessionTotalTime(time > 0 ? formatTimeForSession(time) : null);
      }
    }
  }, [
    activeSession,
    resultsLapsComplete,
    sessionInfo,
    sessionState,
    sessionTime,
  ]);

  useEffect(updateSessionTotalTimeCallback, [
    updateSessionTotalTimeCallback,
    sessionInfo,
    sessionNumber,
  ]);

  useEffect(() => {
    const suffix = sessionTotalTime ? `/${sessionTotalTime}` : "";
    if (
      !forceUseSessionTime &&
      0 < sessionTimeRemaining &&
      sessionTimeRemaining < 604800
    ) {
      setSessionTimeString(
        `${formatTime(sessionTimeRemaining, 0, true)}${suffix}`,
      );
    } else if (sessionTime > 0) {
      setSessionTimeString(`${formatTime(sessionTime, 0, true)}${suffix}`);
    } else {
      setSessionTimeString(null);
    }
  }, [
    sessionTotalTime,
    sessionTime,
    sessionTimeRemaining,
    forceUseSessionTime,
  ]);

  return sessionTimeString;
};

export default useSessionTotalTime;
