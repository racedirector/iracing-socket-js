import React, { useMemo } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import LiveWindDirection from "../LiveWindDirection";
import { Flex } from "@chakra-ui/react";

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
    <Flex>
      <p>{`${name}: ${temperature} (${liveTemperature.toFixed(2)})`}</p>
      {isDeltaPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
      <p>{Math.abs(temperatureDelta)}</p>
    </Flex>
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
    <>
      <h3>Weather Conditons</h3>
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

      {liveWindDirection >= 0 && liveWindVelocity >= 0 && (
        <LiveWindDirection
          direction={liveWindDirection}
          velocity={liveWindVelocity}
        />
      )}
    </>
  );
};

export default WeatherConditions;
