import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { RaceTime, useCurrentSession } from "@racedirector/iracing-socket-js";
import { useAppSelector } from "src/app/hooks";
import { getRaceLengthContext, RaceLengthContextType } from "./context";
import {
  selectEstimatedLapsRemaining,
  selectEstimatedTotalLaps,
  selectLapsCompleted,
} from "src/features/sessionPaceSlice";

export interface RaceLengthProviderProps {}

export const RaceLengthProvider: React.FC<
  PropsWithChildren<RaceLengthProviderProps>
> = ({ children }) => {
  const RaceLengthContext = getRaceLengthContext();
  const totalLapsIndex = useAppSelector(selectEstimatedTotalLaps);
  const lapsRemaining = useAppSelector(selectEstimatedLapsRemaining);
  const lapsComplete = useAppSelector(selectLapsCompleted);
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

  const context: RaceLengthContextType = useMemo(
    () => ({
      raceLaps,
      lapsComplete,
      sessionLength,
      lapsRemaining: lapsRemaining,
      isRaceTimed: typeof sessionLength === "number",
      estimatedLaps: totalLapsIndex,
    }),
    [raceLaps, lapsComplete, sessionLength, lapsRemaining, totalLapsIndex],
  );

  useEffect(() => {
    console.log("Race length context:", context);
  }, [context]);

  return (
    <RaceLengthContext.Provider value={context}>
      {children}
    </RaceLengthContext.Provider>
  );
};
