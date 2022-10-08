import React from "react";
import {
  useCurrentSession,
  useIRacingContext,
  useSessionTotalTime,
} from "@racedirector/iracing-socket-js";
import { SessionInformation as SessionInformationUI } from "../../components/SessionInformation";
import { useStrengthOfFieldContext } from "src/contexts/StrengthOfFieldProvider/context";

export interface SessionInformationProps {}

export const SessionInformation: React.FC<SessionInformationProps> = () => {
  const {
    data: {
      WindDir: liveWindDirection = 0,
      WindVel: liveWindVelocity = 0,
    } = {},
  } = useIRacingContext();
  const { strengthOfField } = useStrengthOfFieldContext();
  const { SessionName = "Unknown" } = useCurrentSession() || {};
  const totalTime = useSessionTotalTime();
  return (
    <SessionInformationUI
      name={SessionName}
      timeRemaining={totalTime}
      direction={liveWindDirection}
      velocity={liveWindVelocity}
      strengthOfField={strengthOfField}
    />
  );
};
