import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  SessionResultsPosition,
  SessionState,
  useCurrentSessionIsRaceSession,
  useCurrentSessionResultsByClass,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { find, isEmpty, isEqual } from "lodash";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addLapTimeForClass,
  selectSessionPace,
  setLapsCompleteForClass,
  setLapTimesForClass,
} from "../../features/sessionPaceSlice";
import usePrevious from "../../hooks/usePrevious";
import { getPaceContext, PaceContextType } from "./context";
import { selectAverageLapTime } from "src/features/averagePaceSlice";

export interface PaceProviderProps {}

export const PaceProvider: React.FC<PropsWithChildren<PaceProviderProps>> = ({
  children,
}) => {
  const PaceContext = getPaceContext();
  const state = useAppSelector(selectSessionPace);
  const dispatch = useAppDispatch();

  const {
    data: {
      SessionState: sessionState = SessionState.Invalid,
      SessionTimeRemain: sessionTimeRemaining = -1,
    } = {},
  } = useIRacingContext();
  const isRaceSession = useCurrentSessionIsRaceSession();
  const classResults = useCurrentSessionResultsByClass();

  const classLeaders: Record<string, SessionResultsPosition> = useMemo(
    () =>
      Object.entries(classResults).reduce(
        (index, [classId, classPositions]) => {
          return {
            ...index,
            [classId]: find(
              classPositions,
              ({ ClassPosition }) => ClassPosition === 0,
            ),
          };
        },
        {},
      ),
    [classResults],
  );

  const previousClassLeaders = usePrevious(classLeaders);

  const checkLapTimes = useCallback(
    (
      classId: string,
      {
        LapsComplete: lapsComplete,
        LastTime: lastTime,
        FastestTime: fastestTime,
      }: SessionResultsPosition,
    ) => {
      const classPace = state?.[classId];
      const averageLapTime = classPace ? selectAverageLapTime(classPace) : -1;
      const classLapsComplete = classPace?.lapsComplete || -1;

      if (
        lapsComplete < 2 ||
        (isRaceSession && lapsComplete <= classLapsComplete) ||
        // !!!: If not in a race session, the average lap time will be the fastest lap time
        // of the session. Ensure that the update includes a faster lap!
        (!isRaceSession && fastestTime <= averageLapTime)
      ) {
        return;
      }

      if (isRaceSession) {
        dispatch(
          setLapsCompleteForClass({
            classId,
            lapsComplete,
          }),
        );
      }

      const timeIsValid = sessionState === SessionState.Racing && lastTime > 0;
      if (timeIsValid) {
        if (isRaceSession) {
          dispatch(
            addLapTimeForClass({
              classId,
              sessionTimeRemaining,
              lapTime: lastTime,
            }),
          );
        } else {
          dispatch(
            setLapTimesForClass({
              classId,
              sessionTimeRemaining,
              lapTimes: [fastestTime],
            }),
          );
        }
      }
    },
    [dispatch, isRaceSession, sessionState, sessionTimeRemaining, state],
  );

  useEffect(() => {
    if (isEmpty(classLeaders)) {
      return;
    }

    const newClassLeaders = !isEqual(classLeaders, previousClassLeaders);

    if (newClassLeaders) {
      Object.entries(classLeaders).forEach(([classId, leader]) => {
        if (leader) {
          checkLapTimes(classId, leader);
        }
      });
    }
  }, [classLeaders, previousClassLeaders, checkLapTimes]);

  return <PaceContext.Provider value={state}>{children}</PaceContext.Provider>;
};

export default PaceProvider;
