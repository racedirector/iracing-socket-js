import React, { useMemo } from "react";
import { useRaceLength } from "src/contexts/RaceLength/hooks";
import { RaceLength as RaceLengthUI } from "../../components/RaceLength";
import { useAppSelector } from "src/app/hooks";

export interface RaceLengthProps {}

export const RaceLength: React.FC<RaceLengthProps> = () => {
  const { sessionTimeRemaining = -1, sessionTime = -1 } = useAppSelector(
    (state) => ({
      sessionTimeRemaining: state.iRacing.data?.SessionTimeRemain,
      sessionTime: state.iRacing.data?.SessionTime,
    }),
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

  return <RaceLengthUI timeElapsed={timeElapsed} totalTime={sessionLength} />;
};

export default RaceLength;
