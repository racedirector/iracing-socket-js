import React, { PropsWithChildren, useEffect, useMemo } from "react";
import {
  RaceTime,
  useCurrentDriver,
  useCurrentDriverResult,
  useCurrentSession,
} from "@racedirector/iracing-socket-js";
import { useAppSelector } from "src/app/hooks";
import { usePace } from "../SessionPace";
import { getRaceLengthContext } from "./context";
import { selectEstimatedTotalLaps } from "src/features/sessionPaceSlice";

export interface RaceLengthProviderProps {}

export const RaceLengthProvider: React.FC<
  PropsWithChildren<RaceLengthProviderProps>
> = ({ children }) => {
  const RaceLengthContext = getRaceLengthContext();
  const totalLapsIndex = useAppSelector(selectEstimatedTotalLaps);
  const { CarClassID = null } = useCurrentDriver() || {};
  const { LapsComplete: currentDriverLapsComplete = 0 } =
    useCurrentDriverResult() || {};
  const paceIndex = usePace();
  const { SessionTime, SessionLaps } = useCurrentSession() || {};

  const raceLaps = useMemo(() => {
    if (typeof SessionLaps === "number") {
      return SessionLaps;
    }

    return null;
  }, [SessionLaps]);

  const sessionLength: RaceTime = useMemo(() => {
    const sessionTime = parseInt(SessionTime);
    if (!Number.isNaN(sessionTime)) {
      return sessionTime;
    }

    return "unlimited";
  }, [SessionTime]);

  const estimatedLapCount = useMemo(() => {
    return totalLapsIndex?.[CarClassID] || -1;
  }, [totalLapsIndex, CarClassID]);

  const lapsComplete = useMemo(() => {
    return currentDriverLapsComplete + 1;
  }, [currentDriverLapsComplete]);

  const lapsRemaining = useMemo(() => {
    const { lapsComplete: fieldLapsComplete = 0 } =
      paceIndex?.[CarClassID] || {};

    const normalizedLapsComplete = Math.max(0, fieldLapsComplete, lapsComplete);

    return Math.ceil(raceLaps || estimatedLapCount) - normalizedLapsComplete;
  }, [CarClassID, estimatedLapCount, lapsComplete, paceIndex, raceLaps]);

  const context = useMemo(
    () => ({
      raceLaps,
      lapsComplete,
      lapsRemaining,
      sessionLength,
      isRaceTimed: typeof sessionLength === "number",
      estimatedLaps: estimatedLapCount,
    }),
    [raceLaps, lapsComplete, lapsRemaining, sessionLength, estimatedLapCount],
  );

  return (
    <RaceLengthContext.Provider value={context}>
      {children}
    </RaceLengthContext.Provider>
  );
};
