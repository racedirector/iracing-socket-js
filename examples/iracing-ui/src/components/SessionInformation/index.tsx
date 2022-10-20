import React from "react";
import { Badge, Box, HStack } from "@chakra-ui/react";
import StrengthOfField, { StrengthOfFieldProps } from "../StrengthOfField";
import WeatherConditions, {
  WeatherConditionsProps,
} from "../WeatherConditions";

export interface SessionInformationProps
  extends WeatherConditionsProps,
    Omit<StrengthOfFieldProps, "index"> {
  name: string;
  sessionType?: string;
  sessionSubType?: string;
  eventType?: string;
  timeRemaining: string;
  strengthOfField: StrengthOfFieldProps["index"];
}

export const SessionInformation: React.FC<SessionInformationProps> = ({
  name,
  eventType,
  sessionType,
  sessionSubType,
  timeRemaining,
  strengthOfField,
  totalStrengthOfField,
  ...weatherProps
}) => {
  return (
    <Box>
      <HStack>
        <Badge variant={"solid"} colorScheme={"green"}>
          {name}
        </Badge>
        {sessionType && (
          <Badge variant={"outline"} colorScheme={"red"}>
            {sessionType}
          </Badge>
        )}
        {sessionSubType && (
          <Badge variant={"outline"} colorScheme={"red"}>
            {sessionSubType}
          </Badge>
        )}
        {eventType && (
          <Badge variant={"solid"} colorScheme={"red"}>
            {eventType}
          </Badge>
        )}
      </HStack>
      <h2>{`Time Remaining: ${timeRemaining}`}</h2>
      {/* <WeatherConditions {...weatherProps} /> */}
      <StrengthOfField
        index={strengthOfField}
        totalStrengthOfField={totalStrengthOfField}
      />
    </Box>
  );
};
