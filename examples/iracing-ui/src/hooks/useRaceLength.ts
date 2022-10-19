import { useEffect, useMemo, useReducer } from "react";
import {
  useRaceSession,
  useSessionSessionTime,
  useSessionSessionLaps,
  useIRacingContext,
  useQualifyResults,
  useDriversInCurrentDriverClass,
  expectedRaceLengthForPositionData,
} from "@racedirector/iracing-socket-js";
import {
  reducer,
  initialState,
  RaceLengthState,
  RaceLengthActionType,
} from "../reducers/raceLength";
import { useAveragePaceForCurrentDriverClass } from "./useAveragePaceForClass";
import { find, isEmpty } from "lodash";

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
    if (raceSessionLength > 0) {
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

type RaceLengthResult = RaceLengthState;

type UseRaceLengthResult = RaceLengthResult;

type UseRaceLengthHook = () => UseRaceLengthResult;

export const useSessionLength: UseRaceLengthHook = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const session = useRaceSession();
  const normalizedSessionLaps = useSessionSessionLaps(session);
  const normalizedSessionTime = useSessionSessionTime(session);
  const currentDriverClassPace = useAveragePaceForCurrentDriverClass();
  const expectedLength = useExpectedRaceLength();

  useEffect(() => {
    if (expectedLength >= 0) {
      dispatch({
        type: RaceLengthActionType.SET_RACE_LAPS,
        payload: expectedLength,
      });
    }
  }, [expectedLength]);

  // If the session laps are updated from iracing and different, update
  useEffect(() => {
    if (normalizedSessionLaps && normalizedSessionLaps !== state.sessionLaps) {
      dispatch({
        type: RaceLengthActionType.SET_SESSION_LAPS,
        payload: normalizedSessionLaps,
      });
    }
  }, [normalizedSessionLaps, state.sessionLaps]);

  // If the session time is updated from iracing and different, update
  useEffect(() => {
    if (
      normalizedSessionTime &&
      normalizedSessionTime !== state.lengthInSeconds
    ) {
      dispatch({
        type: RaceLengthActionType.SET_RACE_TIME,
        payload: normalizedSessionTime,
      });
    }
  }, [normalizedSessionTime, state.lengthInSeconds]);

  // If the session goes official and the laps complete is different, update
  useEffect(() => {
    if (currentDriverClassPace && session.ResultsOfficial) {
      const completedLaps = currentDriverClassPace.lapsComplete;
      if (completedLaps !== state.sessionLaps) {
        dispatch({
          type: RaceLengthActionType.SET_SESSION_LAPS,
          payload: completedLaps,
        });
      }
    }
  }, [currentDriverClassPace, state.sessionLaps, session.ResultsOfficial]);

  useEffect(() => {
    if (!currentDriverClassPace) {
      return;
    }

    const expectedLapCount = currentDriverClassPace.sessionLaps;
    if (
      !normalizedSessionLaps ||
      (expectedLapCount && expectedLapCount < normalizedSessionLaps - 1)
    ) {
      dispatch({
        type: RaceLengthActionType.SET_ESTIMATED_LAPS,
        payload: expectedLapCount,
      });
    }
  }, [currentDriverClassPace, normalizedSessionLaps]);

  useEffect(() => {
    console.log("Race length state:", state);
  }, [state]);

  return state;
};

export default useSessionLength;
