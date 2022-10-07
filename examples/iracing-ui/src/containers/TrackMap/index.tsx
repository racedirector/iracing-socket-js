import React, { useEffect, useMemo, useState } from "react";
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
      WeekendInfo: { TrackID: trackId = 127 } = {},
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

  // const [fakeLaps, setFakeLaps] = useState([-1, 0]);

  // console.log(driverIndex);
  // useEffect(() => {
  //   const timerRef = setTimeout(() => {
  //     setFakeLaps([0, 0.2]);
  //     setTimeout(() => {
  //       setFakeLaps([0, 0.21]);
  //       setTimeout(() => {
  //         setFakeLaps([0, 0.22]);
  //       }, 500);
  //     }, 500);
  //   }, 500);

  //   return () => {
  //     clearTimeout(timerRef);
  //   };
  // }, []);

  return (
    <TrackMapUI
      trackId={trackId}
      driverIndicators={[
        {
          carIndex: 1,
          classColor: "green",
          carNumber: "12",
        },
      ]}
      sectors={sectors}
      // lapPercentages={lapPercentages}
      // pitRoadState={pitRoadState}
      // onTrackState={trackSurfaces}
      startFinishLineColor="red"
      drawSectorLines
    />
  );
};
