import React from "react";
import { Box } from "@chakra-ui/react";
import StrengthOfField, { StrengthOfFieldProps } from "../StrengthOfField";
import WeatherConditions, {
  WeatherConditionsProps,
} from "../WeatherConditions";

export interface SessionInformationProps extends WeatherConditionsProps {
  name: string;
  timeRemaining: string;
  strengthOfField: StrengthOfFieldProps["index"];
}

export const SessionInformation: React.FC<SessionInformationProps> = ({
  name,
  timeRemaining,
  strengthOfField,
  ...weatherProps
}) => {
  return (
    <Box>
      <h1>{`Session "${name}"`}</h1>
      <h2>{`Time Remaining: ${timeRemaining}`}</h2>
      <WeatherConditions {...weatherProps} />
      <StrengthOfField index={strengthOfField} />
    </Box>
  );
};
