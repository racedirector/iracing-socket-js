import {
  SessionResultsPosition,
  SessionState,
  useCurrentSessionIsRaceSession,
  useCurrentSessionResultsByClass,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { find, isEmpty, isEqual } from "lodash";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  addLapTimeForClass,
  selectSessionPace,
  setLapsCompleteForClass,
  setLapTimesForClass,
} from "src/features/sessionPaceSlice";
import usePrevious from "src/hooks/usePrevious";
import { getPaceContext, PaceContextType } from "./context";

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
      const { lapsComplete: previousLapsComplete = 0, averageLapTime } =
        state[classId] || {};

      if (
        lapsComplete < 2 ||
        (isRaceSession && lapsComplete <= previousLapsComplete) ||
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

  const topClassId = useMemo(() => {
    return Object.entries(state).reduce<string>(
      (topClassId, [classId, paceData]) => {
        if (!topClassId) {
          return classId;
        }

        const topClass = state[topClassId];
        if (paceData.averageLapTime < topClass.averageLapTime) {
          return classId;
        }

        return topClassId;
      },
      null,
    );
  }, [state]);

  const context: PaceContextType = useMemo(() => {
    return { index: state, topClassId };
  }, [state, topClassId]);

  useEffect(() => {
    if (isEmpty(classLeaders)) {
      return;
    }

    const newClassLeaders = !isEqual(classLeaders, previousClassLeaders);

    if (newClassLeaders) {
      Object.entries(classLeaders).forEach(([classId, leader]) => {
        checkLapTimes(classId, leader);
      });
    }
  }, [classLeaders, previousClassLeaders, checkLapTimes]);

  return (
    <PaceContext.Provider value={context}>{children}</PaceContext.Provider>
  );
};

export default PaceProvider;
