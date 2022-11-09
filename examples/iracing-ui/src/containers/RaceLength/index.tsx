import React, { useMemo } from "react";
import { useRaceLength } from "src/contexts/RaceLength/hooks";
import { SessionLength as SessionLengthUI } from "../../components/SessionLength";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

const selectSessionLengthContext = (state: RootState) => ({
  sessionTimeRemaining: state.iRacing.data?.SessionTimeRemain,
  sessionTime: state.iRacing.data?.SessionTime,
});

export interface RaceLengthProps {}

export const RaceLength: React.FC<RaceLengthProps> = () => {
  const { sessionTimeRemaining = -1, sessionTime = -1 } = useAppSelector(
    selectSessionLengthContext,
  );

  const { sessionLength } = useRaceLength();

  const timeElapsed = useMemo(() => {
    if (sessionTimeRemaining > 0 && sessionTimeRemaining < 604800) {
      return sessionTimeRemaining;
    } else if (sessionTime > 0) {
      return sessionTime;
    }

    return null;
  }, [sessionTime, sessionTimeRemaining]);

  return (
    <SessionLengthUI timeElapsed={timeElapsed} totalTime={sessionLength} />
  );
};

export default RaceLength;
