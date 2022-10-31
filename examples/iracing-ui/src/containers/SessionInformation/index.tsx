import React from "react";
import {
  useCurrentSession,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { SessionInformation as SessionInformationUI } from "../../components/SessionInformation";
import { SessionClassDetails } from "../SessionClassDetails";
import RaceLength from "../RaceLength";
import { TrackMap } from "../TrackMap";

export interface SessionInformationProps {}

export const SessionInformation: React.FC<SessionInformationProps> = () => {
  const {
    data: {
      WeekendInfo: {
        EventType: eventType = "Unknown",
        SessionID: sessionId,
        SubSessionID: subsessionId,
        SeasonID: seasonId,
        SeriesID: seriesId,
      } = {},
    } = {},
  } = useIRacingContext();
  const {
    SessionName: sessionName = "Unknown",
    SessionType: sessionType = "Unknown",
    SessionSubType: sessionSubType = "Unknown",
  } = useCurrentSession() || {};

  return (
    <SessionInformationUI
      name={sessionName}
      eventType={eventType}
      sessionType={sessionType}
      sessionSubType={sessionSubType}
      sessionId={sessionId.toString()}
      subsessionId={subsessionId.toString()}
      seasonId={seasonId.toString()}
      seriesId={seriesId.toString()}
    >
      <RaceLength />
      <SessionClassDetails />
      <TrackMap />
    </SessionInformationUI>
  );
};
