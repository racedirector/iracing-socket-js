import React from "react";
import { Badge, HStack } from "@chakra-ui/react";
import {
  selectCurrentSession,
  selectIRacingData,
} from "@racedirector/iracing-socket-js";
import { RootState } from "../../app/store";
import { useAppSelector } from "src/app/hooks";

const selectSessionInformation = (state: RootState) => {
  const {
    WeekendInfo: {
      EventType: eventType = "Unknown",
      SessionID: sessionId,
      SubSessionID: subsessionId,
      SeasonID: seasonId,
      SeriesID: seriesId,
    } = {},
  } = selectIRacingData(state.iRacing);
  const {
    SessionName: sessionName = "Unknown",
    SessionType: sessionType = "Unknown",
    SessionSubType: sessionSubType = "Unknown",
  } = selectCurrentSession(state.iRacing) || {};

  return {
    sessionName,
    sessionType,
    sessionSubType,
    eventType,
    sessionId,
    subsessionId,
    seasonId,
    seriesId,
  };
};

export interface SessionDetailsBadgeStackProps {}

export const SessionDetailsBadgeStack: React.FC<
  SessionDetailsBadgeStackProps
> = () => {
  const {
    eventType,
    sessionId,
    subsessionId,
    seasonId,
    seriesId,
    sessionName,
    sessionType,
    sessionSubType,
  } = useAppSelector(selectSessionInformation);

  return (
    <HStack>
      <Badge variant={"solid"} colorScheme={"green"}>
        Name: {sessionName}
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
  );
};
