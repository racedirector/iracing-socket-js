import React, { useMemo } from "react";
import { useIRacingContext } from "@racedirector/iracing-socket-js";
import {
  TrackMap as TrackMapUI,
  TrackMapProps as TrackMapUIProps,
} from "../../components/TrackMap";

export interface TrackMapProps {}

export const TrackMap: React.FC<TrackMapProps> = () => {
  const {
    data: {
      WeekendInfo: { TrackID: trackId } = {},
      SplitTimeInfo: { Sectors = [] } = {},
    } = {},
  } = useIRacingContext();

  const sectors = useMemo<TrackMapUIProps["sectors"]>(
    () =>
      Sectors.map(({ SectorStartPct }) => ({
        lapPercentage: SectorStartPct,
      })),
    [Sectors],
  );

  return (
    <TrackMapUI
      trackId={trackId}
      indicators={[]}
      sectors={sectors}
      drawSectorLines
    />
  );
};
