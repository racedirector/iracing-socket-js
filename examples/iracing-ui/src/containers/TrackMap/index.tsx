import React from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { TrackMap as TrackMapUI } from "../../components/TrackMap";

export interface TrackMapProps {}

export const TrackMap: React.FC<TrackMapProps> = () => {
  const { data: { WeekendInfo: { TrackID: trackId } = {} } = {} } =
    useIRacingContext();

  return <TrackMapUI trackId={trackId} indicators={[]} drawSectorLines />;
};
