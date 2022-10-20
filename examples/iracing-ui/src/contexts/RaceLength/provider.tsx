import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  useCurrentDriver,
  useCurrentDriverResult,
  useCurrentSession,
  useSessionSessionLaps,
  useSessionSessionTime,
} from "@racedirector/iracing-socket-js";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  selectRaceLength,
  setEstimatedLaps,
  setRaceLaps,
  setRaceLength,
} from "src/features/raceLengthSlice";
import { usePace } from "../SessionPace";
import { getRaceLengthContext } from "./context";
import { isEmpty, omit } from "lodash";

export interface RaceLengthProviderProps {}

export const RaceLengthProvider: React.FC<
  PropsWithChildren<RaceLengthProviderProps>
> = ({ children }) => {
  const RaceLengthContext = getRaceLengthContext();
  const state = useAppSelector(selectRaceLength);
  const dispatch = useAppDispatch();
  const { CarClassID = null } = useCurrentDriver() || {};
  const { LapsComplete: currentDriverLapsComplete = 0 } =
    useCurrentDriverResult() || {};
  const { topClassId, index: paceIndex } = usePace();
  const { SessionTime, SessionLaps } = useCurrentSession() || {};

  const isRaceTimed = useMemo(() => {
    return state.lengthInSeconds && typeof state.lengthInSeconds === "number";
  }, [state.lengthInSeconds]);

  const totalLapsIndex = useMemo(() => {
    if (isEmpty(paceIndex) || !topClassId || !isRaceTimed) {
      return;
    }

    const topClass = paceIndex[topClassId];
    const otherClasses = omit(paceIndex, topClassId);
    const topClassTotalLaps =
      topClass.lapsComplete +
      Math.max(1, topClass.sessionTimeRemaining) / topClass.averageLapTime;

    return Object.keys(otherClasses).reduce(
      (index, classId) => {
        const classPace = paceIndex[classId];
        const timeRemainingDifference =
          topClass.sessionTimeRemaining - classPace.sessionTimeRemaining;
        const timeRemainingOffset = Math.max(
          1,
          topClass.sessionTimeRemaining - timeRemainingDifference,
        );

        const totalClassLaps =
          classPace.lapsComplete +
          timeRemainingOffset / classPace.averageLapTime;

        return {
          ...index,
          [classId]: Math.round(totalClassLaps),
        };
      },
      {
        [topClassId]: Math.round(topClassTotalLaps),
      },
    );
  }, [paceIndex, topClassId, isRaceTimed]);

  useEffect(() => {
    if (typeof SessionLaps === "number") {
      dispatch(setRaceLaps(SessionLaps));
    }
  }, [dispatch, SessionLaps]);

  useEffect(() => {
    const sessionTime = parseInt(SessionTime);
    if (!Number.isNaN(sessionTime)) {
      dispatch(setRaceLength(sessionTime));
    }
  }, [dispatch, SessionTime]);

  const estimatedLapCount = useMemo(() => {
    return totalLapsIndex?.[CarClassID] || -1;
  }, [totalLapsIndex, CarClassID]);

  const lapsComplete = useMemo(() => {
    return currentDriverLapsComplete + 1;
  }, [currentDriverLapsComplete]);

  const lapsRemaining = useMemo(() => {
    const { lapsComplete: fieldLapsComplete = 0 } =
      paceIndex?.[CarClassID] || {};
    return (
      Math.ceil(state.sessionLaps) -
      Math.max(0, fieldLapsComplete, lapsComplete)
    );
  }, [CarClassID, lapsComplete, paceIndex, state.sessionLaps]);

  useEffect(() => {
    if (estimatedLapCount > 0) {
      dispatch(setEstimatedLaps(estimatedLapCount));
    }
  }, [dispatch, estimatedLapCount]);

  return (
    <RaceLengthContext.Provider
      value={{ ...state, lapsComplete, lapsRemaining }}
    >
      {children}
    </RaceLengthContext.Provider>
  );
};
