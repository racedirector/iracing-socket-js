import React from "react";
import LiveWindDirection from "../LiveWindDirection";

export interface WeatherConditionsProps {
  trackTemperature: string;
  ambientTemperature: string;
  liveTrackTemperature?: number;
  liveAmbientTemperature?: number;
  trackWindDirection?: string;
  trackWindVelocity?: string;
  liveWindDirection?: number;
  liveWindVelocity?: number;
}

export const WeatherConditions: React.FC<WeatherConditionsProps> = ({
  trackTemperature,
  ambientTemperature,
  liveWindDirection = -1,
  liveWindVelocity = -1,
  liveTrackTemperature = 0,
  liveAmbientTemperature = 0,
}) => (
  <>
    <h3>Weather Conditons</h3>
    <p>{`Track: ${trackTemperature} (${liveTrackTemperature.toFixed(
      2,
    )}) (Delta ${(liveTrackTemperature - parseFloat(trackTemperature)).toFixed(
      2,
    )})`}</p>
    <p>{`Ambient: ${ambientTemperature} (${liveAmbientTemperature.toFixed(
      2,
    )}) (Delta ${(
      liveAmbientTemperature - parseFloat(ambientTemperature)
    ).toFixed(2)})`}</p>
    {liveWindDirection >= 0 && liveWindVelocity >= 0 && (
      <LiveWindDirection
        direction={liveWindDirection}
        velocity={liveWindVelocity}
      />
    )}
  </>
);

export default WeatherConditions;
