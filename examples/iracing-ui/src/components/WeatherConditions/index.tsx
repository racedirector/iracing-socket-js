import React, { useMemo } from "react";
import {
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

interface TemperatureDisplayProps {
  name: string;
  temperature: string;
  liveTemperature: number;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  name,
  temperature,
  liveTemperature,
}) => {
  const temperatureDelta = useMemo(() => {
    return +(liveTemperature - parseFloat(temperature)).toFixed(2);
  }, [liveTemperature, temperature]);

  const isDeltaPositive = useMemo(() => {
    return Math.sign(temperatureDelta) > 0;
  }, [temperatureDelta]);

  return (
    <Stat>
      <StatLabel>{name}</StatLabel>
      <StatNumber>Start: {temperature}</StatNumber>
      <StatNumber>Live: {liveTemperature.toFixed(2)} C</StatNumber>
      <StatHelpText>
        <StatArrow type={isDeltaPositive ? "increase" : "decrease"} />
        {Math.abs(temperatureDelta)} Delta
      </StatHelpText>
    </Stat>
  );
};

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
}) => {
  return (
    <StatGroup>
      <TemperatureDisplay
        name="Track"
        temperature={trackTemperature}
        liveTemperature={liveTrackTemperature}
      />
      <TemperatureDisplay
        name="Ambient"
        temperature={ambientTemperature}
        liveTemperature={liveAmbientTemperature}
      />
    </StatGroup>
  );
};

export default WeatherConditions;
