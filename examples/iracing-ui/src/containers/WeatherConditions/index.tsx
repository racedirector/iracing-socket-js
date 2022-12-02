import React from "react";
import { useIRacingContext } from "src/app/hooks";
import { WeatherConditions as WeatherConditionsUI } from "../../components/WeatherConditions";

export interface WeatherConditionsProps {}

export const WeatherConditions: React.FC<WeatherConditionsProps> = () => {
  const {
    data: {
      AirTemp,
      TrackTemp,
      TrackTempCrew,
      WindDir,
      WindVel,
      WeekendInfo: {
        TrackAirTemp,
        TrackSurfaceTemp,
        TrackWindDir,
        TrackWindVel,
      } = {},
    } = {},
  } = useIRacingContext();

  return (
    <WeatherConditionsUI
      trackTemperature={TrackSurfaceTemp}
      liveTrackTemperature={TrackTemp}
      ambientTemperature={TrackAirTemp}
      liveAmbientTemperature={AirTemp}
      trackWindDirection={TrackWindDir}
      liveWindDirection={WindDir}
      trackWindVelocity={TrackWindVel}
      liveWindVelocity={WindVel}
    />
  );
};

export default WeatherConditions;
