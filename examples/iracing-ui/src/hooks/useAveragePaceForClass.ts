import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  SessionResultsPosition,
  SessionState,
  useCurrentDriver,
  useIRacingContext,
  useCurrentSessionIsRaceSession,
  useCurrentSessionResultsByClass,
} from "@racedirector/iracing-socket-js";
import { find, isEmpty, isEqual, omit } from "lodash";
import usePrevious from "./usePrevious";
import {
  reducer,
  initialState,
  RacePaceState,
  RacePaceActionType,
  ClassAveragePaceState,
} from "../reducers/racePace";

type UseAveragePaceHook = () => RacePaceState;

export const useAveragePace: UseAveragePaceHook = () => {
  const isRaceSession = useCurrentSessionIsRaceSession();
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    data: {
      SessionState: sessionState = SessionState.Invalid,
      SessionTimeRemain = -1,
    } = {},
  } = useIRacingContext();
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

  const checkLapTimesCallback = useCallback(
    (
      classId: string,
      {
        LapsComplete: lapsComplete,
        LastTime: lastTime,
      }: SessionResultsPosition,
    ) => {
      const { lapsComplete: previousLapsComplete = 0 } = state[classId] || {};
      if (lapsComplete < 2 || lapsComplete <= previousLapsComplete) {
        return;
      }

      dispatch({
        type: RacePaceActionType.SET_LAPS_COMPLETE,
        payload: { classId, lapsComplete },
      });

      if (sessionState === SessionState.Racing && lastTime > 0) {
        dispatch({
          type: RacePaceActionType.ADD_LAP_TIME,
          payload: {
            classId,
            lapTime: lastTime,
            sessionTimeRemaining: SessionTimeRemain,
          },
        });
      }
    },
    [SessionTimeRemain, sessionState, state],
  );

  useEffect(() => {
    if (isEmpty(classLeaders) || !isRaceSession) {
      return;
    }

    const newClassLeaders = !isEqual(classLeaders, previousClassLeaders);

    if (newClassLeaders) {
      Object.entries(classLeaders).forEach(([classId, leader]) => {
        checkLapTimesCallback(classId, leader);
      });
    }
  }, [
    checkLapTimesCallback,
    classLeaders,
    isRaceSession,
    previousClassLeaders,
  ]);

  return state;
};

type UseAveragePaceForCurrentDriverClass = () => ClassAveragePaceState;

export const useAveragePaceForCurrentDriverClass: UseAveragePaceForCurrentDriverClass =
  () => {
    const { classes: paceIndex } = useAveragePace();
    const { CarClassID = null } = useCurrentDriver() || {};
    return useMemo(() => {
      return paceIndex?.[CarClassID];
    }, [CarClassID, paceIndex]);
  };

type UseTotalLapsByClassHook = () => Record<string, number>;

export const useTotalLapsByClass: UseTotalLapsByClassHook = () => {
  const { classes: paceIndex } = useAveragePace();
  const isRaceSession = useCurrentSessionIsRaceSession();

  return useMemo(() => {
    if (isEmpty(paceIndex) || !isRaceSession) {
      return null;
    }

    const topClassId = Object.entries(paceIndex).reduce<string>(
      (topClassId, [classId, paceData]) => {
        if (!topClassId) {
          return classId;
        }

        const topClass = paceIndex[topClassId];
        if (paceData.averageLapTime < topClass.averageLapTime) {
          return classId;
        }

        return topClassId;
      },
      null,
    );

    const topClass = paceIndex[topClassId];
    const lapsRemaining =
      topClass.lapsComplete +
      Math.max(1, topClass.sessionTimeRemaining) / topClass.averageLapTime;

    const roundedLaps = Math.round(lapsRemaining + 0.5);

    const lapsRemainingIndex: Record<string, number> = {
      [topClassId]: roundedLaps,
    };

    const otherClasses = omit(paceIndex, topClassId);

    // If there are no other classes, return the index as-is
    if (isEmpty(otherClasses)) {
      return lapsRemainingIndex;
    } else {
      return Object.keys(otherClasses).reduce((index, classId) => {
        const classPace = paceIndex[classId];
        const timeRemainingDifference =
          topClass.sessionTimeRemaining - classPace.sessionTimeRemaining;
        const timeRemainingOffset = Math.max(
          1,
          topClass.sessionTimeRemaining - timeRemainingDifference,
        );
        const classLapsRemaining =
          classPace.lapsComplete +
          timeRemainingOffset / classPace.averageLapTime;

        return {
          ...index,
          [classId]: Math.round(classLapsRemaining + 0.5),
        };
      }, lapsRemainingIndex);
    }
  }, [isRaceSession, paceIndex]);
};

type UseRemainingLapsByClassHook = () => Record<string, number>;

export const useRemainingLapsByClass: UseRemainingLapsByClassHook = () => {
  const { classes: paceIndex } = useAveragePace();
  const totalLapsIndex = useTotalLapsByClass();

  const remainingLapsIndex = useMemo(() => {
    if (isEmpty(paceIndex) || isEmpty(totalLapsIndex)) {
      return null;
    }

    return Object.entries(paceIndex).reduce((index, [classId, classPace]) => {
      const totalLaps = totalLapsIndex[classId];
      const remainingLaps = totalLaps - classPace.lapsComplete;

      return {
        ...index,
        [classId]: remainingLaps,
      };
    }, {});
  }, [paceIndex, totalLapsIndex]);

  return remainingLapsIndex;
};

type UseTotalLapsForCurrentDriverClassHook = () => number;

export const useTotalLapsForCurrentDriverClass: UseTotalLapsForCurrentDriverClassHook =
  () => {
    const totalLapsIndex = useTotalLapsByClass();
    const { CarClassID = null } = useCurrentDriver() || {};
    return useMemo(() => {
      return totalLapsIndex?.[CarClassID] || -1;
    }, [totalLapsIndex, CarClassID]);
  };

type UseRemainingLapsForCurrentDriverClassHook = () => number;

export const useRemainingLapsForCurrentDriverClass: UseRemainingLapsForCurrentDriverClassHook =
  () => {
    const remainingLapsIndex = useRemainingLapsByClass();
    const { CarClassID = null } = useCurrentDriver() || {};
    return useMemo(() => {
      return remainingLapsIndex?.[CarClassID] || -1;
    }, [remainingLapsIndex, CarClassID]);
  };
