import { useIRacingContext } from "@racedirector/iracing-socket-js";
import React from "react";
import { WeatherConditions as WeatherConditionsUI } from "../../components/WeatherConditions";

export interface WeatherConditionsProps {}

export const WeatherConditions: React.FC<WeatherConditionsProps> = () => {
  const {
    data: {
      WindDir,
      WindVel,
      WeekendInfo: {
        TrackAirTemp = null,
        TrackSurfaceTemp = null,
        TrackWindDir,
        TrackWindVel,
        WeekendOptions: { WindDirection, WindSpeed } = {},
      } = {},
    } = {},
  } = useIRacingContext();

  return (
    <WeatherConditionsUI
      ambientTemperature={TrackAirTemp}
      trackTemperature={TrackSurfaceTemp}
      trackWindDirection={TrackWindDir}
      trackWindVelocity={TrackWindVel}
      windDirection={WindDirection}
      windSpeed={WindSpeed}
      liveWindDirection={WindDir}
      liveWindVelocity={WindVel}
    />
  );
};

export default WeatherConditions;
