import React, { useMemo } from "react";
import {
  useDriversByCarIndex,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import {
  TrackMap as TrackMapUI,
  TrackMapProps as TrackMapUIProps,
} from "../../components/TrackMap";

export interface TrackMapProps {}

export const TrackMap: React.FC<TrackMapProps> = () => {
  const driverIndex = useDriversByCarIndex({
    includePaceCar: false,
  });
  const {
    data: {
      WeekendInfo: {
        TrackID: trackId = 127,
        TrackLength: trackLength = "0.0 km",
      } = {},
      SplitTimeInfo: { Sectors = [] } = {},
      CarIdxLapDistPct: lapPercentages = [],
      CarIdxOnPitRoad: pitRoadState = [],
      CarIdxSessionFlags = [],
      CarIdxTrackSurface: trackSurfaces = [],
    } = {},
  } = useIRacingContext();

  const sectors = useMemo<TrackMapUIProps["sectors"]>(
    () =>
      Sectors.map(({ SectorStartPct }) => ({
        lapPercentage: SectorStartPct,
      })),
    [Sectors],
  );

  const driverIndicators = useMemo<TrackMapUIProps["driverIndicators"]>(() => {
    return Object.entries(driverIndex).map(([, driver]) => {
      return {
        carIndex: driver.CarIdx,
        classColor: `#${driver.CarClassColor.toString(16)}`,
        carNumber: driver.CarNumber,
      };
    });
  }, [driverIndex]);

  return (
    <TrackMapUI
      trackId={trackId}
      trackLength={parseFloat(trackLength)}
      driverIndicators={driverIndicators}
      sectors={sectors}
      lapPercentages={lapPercentages}
      pitRoadState={pitRoadState}
      onTrackState={trackSurfaces}
      startFinishLineColor="red"
      drawSectorLines
    />
  );
};
