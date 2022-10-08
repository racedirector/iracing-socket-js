import React from "react";
import { Box } from "@chakra-ui/react";
import LiveWindDirection, {
  LiveWindDirectionProps,
} from "../LiveWindDirection";
import StrengthOfField, { StrengthOfFieldProps } from "../StrengthOfField";

export interface SessionInformationProps extends LiveWindDirectionProps {
  name: string;
  timeRemaining: string;
  strengthOfField: StrengthOfFieldProps["index"];
}

export const SessionInformation: React.FC<SessionInformationProps> = ({
  name,
  timeRemaining,
  strengthOfField,
  ...windProps
}) => {
  return (
    <Box>
      <h1>{`Session "${name}"`}</h1>
      <h2>{`Time Remaining: ${timeRemaining}`}</h2>
      <LiveWindDirection {...windProps} />
      <StrengthOfField index={strengthOfField} />
    </Box>
  );
};
