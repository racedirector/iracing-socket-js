import React from "react";
import {
  selectCurrentSession,
  selectIRacingData,
} from "@racedirector/iracing-socket-js";
import { SessionInformation as SessionInformationUI } from "../../components/SessionInformation";
import { SessionClassDetails } from "../SessionClassDetails";
import RaceLength from "../RaceLength";
import { TrackMap } from "../TrackMap";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

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

export interface SessionInformationProps {}

export const SessionInformation: React.FC<SessionInformationProps> = () => {
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
    <SessionInformationUI
      name={sessionName}
      eventType={eventType}
      sessionType={sessionType}
      sessionSubType={sessionSubType}
      sessionId={sessionId?.toString()}
      subsessionId={subsessionId?.toString()}
      seasonId={seasonId?.toString()}
      seriesId={seriesId?.toString()}
    >
      <RaceLength />
      <SessionClassDetails />
      <TrackMap />
    </SessionInformationUI>
  );
};
