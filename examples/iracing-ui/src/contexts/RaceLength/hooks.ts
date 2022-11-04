import { useContext, useMemo } from "react";
import {
  RaceTime,
  useCurrentDriver,
  useCurrentDriverResult,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { useAppSelector } from "src/app/hooks";
import { selectRaceLengthContext } from "src/features/sessionPaceSlice";

export const useRaceLength = () => useAppSelector(selectRaceLengthContext);

export const useLapsRemainingForCurrentDriverClass = () => {
  const { lapsRemaining } = useRaceLength();
  const { CarClassID = -1 } = useCurrentDriver() || {};

  return useMemo(
    () => lapsRemaining?.[CarClassID] || 0,
    [lapsRemaining, CarClassID],
  );
};

export const useLapsRemainingForCurrentDriver = () => {
  const { raceLaps } = useRaceLength();
  const estimatedClassLaps = useEstimatedLapsForCurrentDriverClass();
  const remainingClassLaps = useLapsRemainingForCurrentDriverClass();

  const { LapsComplete: currentDriverLapsComplete = 0 } =
    useCurrentDriverResult() || {};

  const totalRaceLaps = raceLaps || estimatedClassLaps;
  const lapsCompleted = Math.max(
    0,
    remainingClassLaps,
    currentDriverLapsComplete,
  );

  return totalRaceLaps - lapsCompleted;
};

export const useLapsCompleteForCurrentDriverClass = () => {
  const { lapsComplete } = useRaceLength();
  const { CarClassID = -1 } = useCurrentDriver() || {};

  return useMemo(
    () => lapsComplete?.[CarClassID] || 0,
    [lapsComplete, CarClassID],
  );
};

export const useEstimatedLapsForCurrentDriverClass = () => {
  const { estimatedLaps } = useRaceLength();
  const { CarClassID = -1 } = useCurrentDriver() || {};

  return useMemo(
    () => estimatedLaps?.[CarClassID] || 0,
    [estimatedLaps, CarClassID],
  );
};

export const useTotalSessionTime = () => {
  const { sessionLength, isRaceTimed, raceLaps } = useRaceLength();

  const {
    data: {
      SessionInfo: sessionInfo,
      SessionNum: sessionNumber,
      SessionTime: sessionTime,
      SessionTimeRemain: sessionTimeRemaining,
      SessionState: sessionState,
    } = {},
  } = useIRacingContext();

  if (isRaceTimed) {
    return sessionLength;
  } else {
    console.log("We should estimate how long this race will take");
    return undefined;
  }
};

export const useTimeRemaining = (): RaceTime => {
  const { sessionLength, isRaceTimed } = useRaceLength();
  const {
    data: {
      SessionInfo: sessionInfo,
      SessionNum: sessionNumber,
      SessionTime: sessionTime,
      SessionTimeRemain: sessionTimeRemaining,
      SessionState: sessionState,
    } = {},
  } = useIRacingContext();

  console.log(sessionTime, sessionTimeRemaining);
  if (isRaceTimed) {
  } else {
    console.log("We should estimate how long this race will take");
  }

  return "unlimited";
};
