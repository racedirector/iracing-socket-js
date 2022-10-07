import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import DriverIndicator, {
  DriverIndicatorRef,
} from "./components/DriverIndicator";
import TrackPath, {
  TrackPathProps,
  TrackPathRef,
} from "./components/TrackPath";
import tracks from "./tracks.json";

interface DriverIndicator {
  carIndex: number;
  classColor: string;
  carNumber: string;
}

interface DriverIndicatorStyles {
  radius: number;
  highlightWidth: number;
  color: string;
}

const DEFAULT_DRIVER_INDICATOR_STYLE: DriverIndicatorStyles = {
  radius: 12,
  highlightWidth: 4,
  color: "yellow",
};

export interface TrackMapProps
  extends Omit<
    TrackPathProps,
    | "trackPath"
    | "pitLanePath"
    | "extendedTrackPath"
    | "trackPathWidth"
    | "trackPathColor"
  > {
  trackId: number;
  drawSectorLines: boolean;
  driverIndicators: DriverIndicator[];

  trackPathWidth?: number;
  trackPathColor?: string;

  driverIndicatorStyles?: DriverIndicatorStyles;

  style?: React.CSSProperties;
}

export const TrackMap: React.FC<TrackMapProps> = ({
  trackId,
  driverIndicators: driverIndicatorsProps = [],
  sectors = [],
  driverIndicatorStyles = DEFAULT_DRIVER_INDICATOR_STYLE,
  drawSectorLines: shouldDrawSectorLines = true,
  trackPathColor: trackLineColor = "black",
  trackPathWidth: trackLineWidth = 10,
  startFinishLineColor = "white",
  startFinishLineWidth = trackLineWidth * 3,
  sectorLineColor = "yellow",
  sectorLineWidth = trackLineWidth * 2,
  style,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const trackPathRef = useRef<TrackPathRef>(null);
  const driverCircleRefs = useRef<{
    [key: string]: DriverIndicatorRef;
  }>({});
  const [trackViewBox, setTrackViewBox] = useState(null);
  const [paths, setPaths] = useState([]);

  const driverIndicators = useMemo(() => {
    return driverIndicatorsProps.map(({ classColor, carNumber, carIndex }) => (
      <DriverIndicator
        key={`driver-${carIndex}`}
        ref={(ref) => (driverCircleRefs.current[carIndex] = ref)}
        carNumber={carNumber}
        classColor={classColor}
      />
    ));
  }, [driverIndicatorsProps]);

  useLayoutEffect(() => {
    if (!trackViewBox) {
      const viewBox = trackPathRef.current.getViewBox();
      console.log(viewBox);
      if (viewBox) {
        setTrackViewBox(viewBox);
      }
    }
  }, []);

  useEffect(() => {
    if (trackId && tracks[trackId]) {
      setPaths(tracks[trackId].paths);
    }
  }, [trackId]);

  useEffect(() => {
    console.log("View box:", trackViewBox);
  }, [trackViewBox]);

  return (
    <svg
      ref={containerRef}
      // viewBox={trackViewBox}
      xmlns="<http://www.w3.org/2000/svg>"
    >
      <TrackPath
        ref={trackPathRef}
        trackPath={paths.at(0)}
        trackPathWidth={trackLineWidth}
        trackPathColor={trackLineColor}
        pitLanePath={paths.at(1)}
        startFinishLineColor={startFinishLineColor}
        startFinishLineWidth={startFinishLineWidth}
        sectors={sectors}
        sectorLineColor={sectorLineColor}
        sectorLineWidth={sectorLineWidth}
        drawStartFinishLine
      />

      {driverIndicators}
    </svg>
  );
};

export default TrackMap;
