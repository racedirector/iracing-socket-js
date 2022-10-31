import React, { PropsWithChildren } from "react";
import { Badge, Box, HStack } from "@chakra-ui/react";

export interface SessionInformationProps {
  name: string;
  sessionType?: string;
  sessionSubType?: string;
  eventType?: string;
  sessionId?: string;
  subsessionId?: string;
  seasonId?: string;
  seriesId?: string;
}

export const SessionInformation: React.FC<
  PropsWithChildren<SessionInformationProps>
> = ({
  name,
  eventType = null,
  sessionType = null,
  sessionSubType = null,
  sessionId,
  subsessionId,
  seriesId,
  seasonId,
  children = null,
}) => {
  return (
    <Box>
      <HStack>
        <Badge variant={"solid"} colorScheme={"green"}>
          Name: {name}
        </Badge>
        {sessionType && (
          <Badge variant={"outline"} colorScheme={"red"}>
            Type: {sessionType}
          </Badge>
        )}
        {sessionSubType && (
          <Badge variant={"outline"} colorScheme={"red"}>
            Subtype: {sessionSubType}
          </Badge>
        )}
        {eventType && (
          <Badge variant={"solid"} colorScheme={"red"}>
            Event type: {eventType}
          </Badge>
        )}
        {sessionId && (
          <Badge variant={"solid"} colorScheme={"blue"}>
            Session ID: {sessionId}
          </Badge>
        )}
        {subsessionId && (
          <Badge variant={"outline"} colorScheme={"blue"}>
            Subsession ID: {subsessionId}
          </Badge>
        )}
        {seasonId && (
          <Badge variant={"solid"} colorScheme={"green"}>
            Season ID: {seasonId}
          </Badge>
        )}
        {seriesId && (
          <Badge variant={"outline"} colorScheme={"green"}>
            Series ID: {seriesId}
          </Badge>
        )}
      </HStack>
      {children}
    </Box>
  );
};
