import React from "react";
import {
  useCurrentSession,
  useIRacingContext,
  useSessionTotalTime,
} from "@racedirector/iracing-socket-js";
import { SessionInformation as SessionInformationUI } from "../../components/SessionInformation";
import { useStrengthOfFieldContext } from "../../contexts/StrengthOfField/context";

export interface SessionInformationProps {}

export const SessionInformation: React.FC<SessionInformationProps> = () => {
  const {
    data: {
      AirTemp = 0,
      TrackTemp = 0,
      WindDir: liveWindDirection = 0,
      WindVel: liveWindVelocity = 0,
      WeekendInfo: {
        TrackAirTemp = null,
        TrackSurfaceTemp = null,
        TrackWindDir,
        TrackWindVel,
        WeekendOptions: { WindDirection, WindSpeed } = {},
      } = {},
    } = {},
  } = useIRacingContext();
  const { strengthOfField, totalStrengthOfField } = useStrengthOfFieldContext();
  const { SessionName = "Unknown" } = useCurrentSession() || {};
  const totalTime = useSessionTotalTime();
  // const windDirectionDegrees = useWindDirection();

  return (
    <SessionInformationUI
      name={SessionName}
      timeRemaining={totalTime}
      ambientTemperature={TrackAirTemp}
      liveAmbientTemperature={AirTemp}
      trackTemperature={TrackSurfaceTemp}
      liveTrackTemperature={TrackTemp}
      trackWindDirection={TrackWindDir}
      trackWindVelocity={TrackWindVel}
      liveWindDirection={liveWindDirection}
      liveWindVelocity={liveWindVelocity}
      strengthOfField={strengthOfField}
      totalStrengthOfField={totalStrengthOfField}
    />
  );
};
