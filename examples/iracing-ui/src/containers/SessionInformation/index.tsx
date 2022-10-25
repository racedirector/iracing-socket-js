import React, { useEffect } from "react";
import {
  useCurrentSession,
  useIRacingContext,
  useSessionTotalTime,
} from "@racedirector/iracing-socket-js";
import { SessionInformation as SessionInformationUI } from "../../components/SessionInformation";
import { useStrengthOfFieldContext } from "../../contexts/StrengthOfField/context";
import { useRaceLength } from "src/contexts/RaceLength";

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
        EventType: eventType = "Unknown",
      } = {},
    } = {},
  } = useIRacingContext();
  const { isRaceTimed } = useRaceLength();
  const { strengthOfField, totalStrengthOfField } = useStrengthOfFieldContext();
  const {
    SessionName: sessionName = "Unknown",
    SessionType: sessionType = "Unknown",
    SessionSubType: sessionSubType = "Unknown",
  } = useCurrentSession() || {};
  const totalTime = useSessionTotalTime();
  // const windDirectionDegrees = useWindDirection();

  return (
    <SessionInformationUI
      name={sessionName}
      timeRemaining={totalTime}
      eventType={eventType}
      sessionType={sessionType}
      sessionSubType={sessionSubType}
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
