import { useEffect, useMemo } from "react";
import {
  useRaceSession,
  useSessionSessionTime,
  useSessionSessionLaps,
  useIRacingContext,
  useQualifyResults,
  useDriversInCurrentDriverClass,
  expectedRaceLengthForPositionData,
} from "@racedirector/iracing-socket-js";
import { find, isEmpty } from "lodash";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  setEstimatedLaps,
  setRaceLaps,
  setRaceLength,
  setSessionLaps,
} from "src/features/raceLengthSlice";
import { useCurrentDriverClassPace } from "src/contexts/SessionPace";

const useExpectedRaceLength = () => {
  const { data: { SessionInfo: { Sessions: sessions = [] } = {} } = {} } =
    useIRacingContext();
  const session = useRaceSession();
  const raceSessionLength = useSessionSessionTime(session);
  const qualifyResults = useQualifyResults();
  const driverIndexesInClass = useDriversInCurrentDriverClass();

  const liveSessionResults = useMemo(() => {
    const session =
      find(sessions, ({ SessionType: type }) => /qual/i.test(type)) ||
      find(sessions, ({ SessionType: type }) => !/race/i.test(type));

    return session?.ResultsPositions || [];
  }, [sessions]);

  return useMemo(() => {
    if (typeof raceSessionLength === "number" && raceSessionLength > 0) {
      if (!isEmpty(qualifyResults)) {
        return expectedRaceLengthForPositionData(
          raceSessionLength,
          qualifyResults,
          driverIndexesInClass,
        );
      } else if (!isEmpty(liveSessionResults)) {
        return expectedRaceLengthForPositionData(
          raceSessionLength,
          liveSessionResults,
          driverIndexesInClass,
        );
      }

      return -1;
    }
  }, [
    driverIndexesInClass,
    liveSessionResults,
    qualifyResults,
    raceSessionLength,
  ]);
};

export const useSessionLength = () => {
  // const state = useAppSelector((state) => state.raceLength);
  // const dispatch = useAppDispatch();
  // const session = useRaceSession();
  // const normalizedSessionLaps = useSessionSessionLaps(session);
  // const normalizedSessionTime = useSessionSessionTime(session);
  // const currentDriverClassPace = useCurrentDriverClassPace();
  // const expectedLength = useExpectedRaceLength();
  // useEffect(() => {
  //   if (expectedLength >= 0) {
  //     dispatch(setRaceLaps(expectedLength));
  //   }
  // }, [dispatch, expectedLength]);
  // // If the session laps are updated from iracing and different, update
  // useEffect(() => {
  //   if (normalizedSessionLaps && normalizedSessionLaps !== state.sessionLaps) {
  //     dispatch(setSessionLaps(normalizedSessionLaps));
  //   }
  // }, [dispatch, normalizedSessionLaps, state.sessionLaps]);
  // // If the session time is updated from iracing and different, update
  // useEffect(() => {
  //   if (
  //     normalizedSessionTime &&
  //     normalizedSessionTime !== state.lengthInSeconds
  //   ) {
  //     dispatch(setRaceLength(normalizedSessionTime));
  //   }
  // }, [dispatch, normalizedSessionTime, state.lengthInSeconds]);
  // // If the session goes official and the laps complete is different, update
  // useEffect(() => {
  //   if (currentDriverClassPace && session.ResultsOfficial) {
  //     const completedLaps = currentDriverClassPace.lapsComplete;
  //     if (completedLaps !== state.sessionLaps) {
  //       dispatch(setSessionLaps(completedLaps));
  //     }
  //   }
  // }, [
  //   currentDriverClassPace,
  //   state.sessionLaps,
  //   session.ResultsOfficial,
  //   dispatch,
  // ]);
  // useEffect(() => {
  //   if (!currentDriverClassPace) {
  //     return;
  //   }
  //   const expectedLapCount = currentDriverClassPace.sessionLaps;
  //   if (
  //     !normalizedSessionLaps ||
  //     (expectedLapCount && expectedLapCount < normalizedSessionLaps - 1)
  //   ) {
  //     dispatch(setEstimatedLaps(expectedLapCount));
  //   }
  // }, [currentDriverClassPace, dispatch, normalizedSessionLaps]);
  // return state;
};

export default useSessionLength;
