import React from "react";
import LiveWindDirection from "../LiveWindDirection";

export interface WeatherConditionsProps {
  trackTemperature: number;
  ambientTemperature: number;
  liveTrackTemperature?: number;
  liveAmbientTemperature?: number;
  windDirection: string;
  windSpeed: string;
  trackWindDirection?: number;
  trackWindVelocity?: number;
  liveWindDirection?: number;
  liveWindVelocity?: number;
}

export const WeatherConditions: React.FC<WeatherConditionsProps> = ({
  trackTemperature,
  ambientTemperature,
  windDirection,
  windSpeed,
  liveWindDirection = -1,
  liveWindVelocity = -1,
  liveTrackTemperature = 0,
  liveAmbientTemperature = 0,
}) => (
  <>
    <h3>Weather Conditons</h3>
    <p>{`Track: ${trackTemperature} (${liveTrackTemperature})`}</p>
    <p>{`Ambient: ${ambientTemperature} (${liveAmbientTemperature})`}</p>
    <p>{`Wind: ${windDirection} at ${windSpeed}`}</p>
    {liveWindDirection >= 0 && liveWindVelocity >= 0 && (
      <LiveWindDirection
        direction={liveWindDirection}
        velocity={liveWindVelocity}
      />
    )}
  </>
);

export default WeatherConditions;
