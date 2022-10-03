import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import tracks from "./tracks.json";

const GAP = 1;

const getLinePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) => {
  return `M${startX} ${startY} L${endX} ${endY}`;
};

const getLineAngle = (x1: number, y1: number, x2: number, y2: number) => {
  const x = x1 - x2;
  const y = y1 - y2;

  if (!x && !y) {
    return 0;
  }

  return (180 + (Math.atan2(-y, -x) * 180) / Math.PI + 360) % 360;
};

interface TrackMapIndicator {
  lapPercentage: number;
}

interface DriverIndicator {
  carIndex: number;
  classColor: string;
  carNumber: string;
}

interface StartFinishLineIndicator {
  path: string;
  transform: string;
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

export interface TrackMapProps {
  trackId: number;
  trackLength: number;
  drawSectorLines: boolean;
  driverIndicators: DriverIndicator[];
  sectors: TrackMapIndicator[];
  lapPercentages?: number[];
  onTrackState?: number[];
  pitRoadState?: number[];

  startFinishLineColor?: string;
  startFinishLineWidth?: number;

  sectorLineColor?: string;
  sectorLineWidth?: number;

  trackLineColor?: string;
  trackLineWidth?: number;

  drawTrackOutline?: boolean;
  trackOutlineColor?: string;

  driverIndicatorStyles?: DriverIndicatorStyles;

  style?: React.CSSProperties;
}

export const TrackMap: React.FC<TrackMapProps> = ({
  trackId,
  trackLength,
  driverIndicators: driverIndicatorsProps = [],
  sectors = [],
  lapPercentages = [],
  onTrackState = [],
  pitRoadState = [],
  driverIndicatorStyles = DEFAULT_DRIVER_INDICATOR_STYLE,
  drawSectorLines: shouldDrawSectorLines = true,
  trackLineColor = "black",
  trackLineWidth = 10,
  startFinishLineColor = "white",
  startFinishLineWidth = trackLineWidth * 3,
  sectorLineColor = "yellow",
  sectorLineWidth = trackLineWidth * 2,
  style,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const driverCircleRefs = useRef<{
    [key: string]: SVGGElement;
  }>({});

  const [distancePercentPerMeter, setDistancePercentPerMeter] = useState(
    1 / (1000 * trackLength),
  );
  const [trackViewBox, setTrackViewBox] = useState("0 0 0 0");
  const [paths, setPaths] = useState([]);
  const [sectorLinePaths, setSectorLinePaths] = useState<
    StartFinishLineIndicator[]
  >([]);
  const [startFinishLine, setStartFinishLinePath] =
    useState<StartFinishLineIndicator>(null);

  const drawStartFinishLine = useCallback(() => {
    const startCoordinates = trackPathRef.current.getPointAtLength(0.0);
    const pathAngle = trackPathRef.current.getPointAtLength(0.1);

    const rotateAngle = getLineAngle(
      startCoordinates.x,
      startCoordinates.y,
      pathAngle.x,
      pathAngle.y,
    );

    const halfWidth = startFinishLineWidth / 2;

    setStartFinishLinePath({
      path: getLinePath(
        startCoordinates.x,
        startCoordinates.y - halfWidth,
        startCoordinates.x,
        startCoordinates.y + halfWidth,
      ),
      transform: `rotate(${rotateAngle} ${startCoordinates.x} ${startCoordinates.y})`,
    });
  }, [startFinishLineWidth]);

  const drawSectorLines = useCallback(() => {
    const halfWidth = sectorLineWidth / 2;
    const currentTrackPathLength = trackPathRef.current.getTotalLength();

    const sectorPaths = sectors.map(({ lapPercentage }) => {
      const sectorCoordinates = trackPathRef.current.getPointAtLength(
        lapPercentage * currentTrackPathLength,
      );

      const sectorAngle = trackPathRef.current.getPointAtLength(
        lapPercentage * currentTrackPathLength + 0.1,
      );

      const sectorRotation = getLineAngle(
        sectorCoordinates.x,
        sectorCoordinates.y,
        sectorAngle.x,
        sectorAngle.y,
      );

      return {
        path: getLinePath(
          sectorCoordinates.x,
          sectorCoordinates.y - halfWidth,
          sectorCoordinates.x,
          sectorCoordinates.y + halfWidth,
        ),
        transform: `rotate(${sectorRotation} ${sectorCoordinates.x} ${sectorCoordinates.y})`,
      };
    });

    setSectorLinePaths(sectorPaths);
  }, [sectorLineWidth, sectors]);

  // TODO: Cache these
  const getDriverCoordinates = useCallback(
    (lapPercentage) => {
      if (trackPathRef.current) {
        const currentTrackPathLength = trackPathRef.current.getTotalLength();
        const driverCoordinates = trackPathRef.current.getPointAtLength(
          lapPercentage * currentTrackPathLength,
        );

        return driverCoordinates;
      }

      return null;
    },
    [trackPathRef],
  );

  const driverIndicators = useMemo(() => {
    return driverIndicatorsProps.map(({ classColor, carNumber, carIndex }) => {
      return (
        <g
          key={`driver-${carIndex}`}
          ref={(ref) => (driverCircleRefs.current[carIndex] = ref)}
        >
          <circle
            r={"10"}
            key={`driver-${carIndex.toString()}`}
            fill={classColor}
            strokeWidth={0}
            stroke={"#4DFF51"}
          />
          <text fill="black">{carNumber}</text>
        </g>
      );
    });
  }, [driverIndicatorsProps]);

  const sectorIndicators = useMemo(() => {
    return sectorLinePaths.map(({ path: pathString, transform }, index) => (
      <path
        key={`sector-${index}`}
        d={pathString}
        transform={transform}
        strokeWidth={trackLineWidth * 0.5}
        stroke={sectorLineColor}
      />
    ));
  }, [sectorLineColor, sectorLinePaths, trackLineWidth]);

  useEffect(() => {
    const nextValue = 1 / (1000 * trackLength);
    setDistancePercentPerMeter((previousValue) => {
      return nextValue !== previousValue ? nextValue : previousValue;
    });
  }, [trackLength]);

  useEffect(() => {
    if (trackPathRef.current) {
      const trackDimensions = trackPathRef.current.getBBox();
      const largestRadius = startFinishLineWidth / 2;
      const constant = largestRadius + GAP;

      setTrackViewBox(
        `${trackDimensions.x - constant} ${trackDimensions.y - constant} ${
          trackDimensions.width + constant * 2
        } ${trackDimensions.height + constant * 2}`,
      );

      drawStartFinishLine();

      if (shouldDrawSectorLines) {
        drawSectorLines();
      }
    }
  }, [
    drawSectorLines,
    drawStartFinishLine,
    shouldDrawSectorLines,
    startFinishLineWidth,
    trackPathRef,
  ]);

  useEffect(() => {
    if (trackId && tracks[trackId]) {
      setPaths(tracks[trackId].paths);
    }
  }, [trackId]);

  /// Animate the driver cricles to the correct percentage
  useEffect(() => {
    lapPercentages.forEach((percentage, index) => {
      const driverCircle = driverCircleRefs.current[index];
      if (driverCircle) {
        const coordinates = getDriverCoordinates(percentage);
        driverCircle.setAttribute("opacity", percentage === -1 ? "0" : "1.0");
        driverCircle.setAttribute(
          "transform",
          `translate(${coordinates.x} ${coordinates.y})`,
        );
      }
    });
  }, [getDriverCoordinates, lapPercentages]);

  /// Add on/off track styles
  // ???: Should this be a reducer or something?
  useEffect(() => {
    onTrackState.forEach((isOnTrack, index) => {
      const driverCircleGroup = driverCircleRefs.current[index];
      if (driverCircleGroup) {
        const driverCircle = driverCircleGroup.firstChild as SVGGElement;

        if (!isOnTrack) {
          driverCircle.setAttribute(
            "stroke-width",
            driverIndicatorStyles.highlightWidth.toString(),
          );

          driverCircle.setAttribute("stroke", "red");
        } else {
          driverCircle.setAttribute("opacity", "1.0");
          driverCircle.setAttribute("stroke-width", "0");
        }
      }
    });
  }, [driverIndicatorStyles.highlightWidth, onTrackState]);

  /// Add on/off pit lane styles
  useEffect(() => {
    pitRoadState.forEach((isOnPitRoad, index) => {
      const driverCircleGroup = driverCircleRefs.current[index];
      if (driverCircleGroup) {
        const driverCircle = driverCircleGroup.firstChild as SVGGElement;
        driverCircle.setAttribute("opacity", isOnPitRoad ? "0.5" : "1.0");
      }
    });
  }, [pitRoadState]);

  return (
    <svg
      ref={containerRef}
      viewBox={trackViewBox}
      xmlns="<http://www.w3.org/2000/svg>"
    >
      <g fill="none" fillOpacity={0}>
        {paths.map((pathString, index) => {
          const isTrackOutline = index === 0;
          if (isTrackOutline) {
            return (
              <>
                <path
                  key="track-outline"
                  d={pathString}
                  stroke={"#FFFFFF"}
                  strokeWidth={trackLineWidth * 1.8}
                  strokeOpacity={0.3}
                />
                <path
                  key="track"
                  ref={trackPathRef}
                  d={pathString}
                  stroke={trackLineColor}
                  strokeWidth={trackLineWidth}
                />
              </>
            );
          } else {
            return (
              <>
                <path
                  key="pit-outline"
                  d={pathString}
                  stroke={"#FFFFFF"}
                  strokeWidth={trackLineWidth * 1.5}
                />
                <path
                  key="pit"
                  d={pathString}
                  stroke={trackLineColor}
                  strokeWidth={trackLineWidth * 0.7}
                />
              </>
            );
          }
        })}
      </g>

      {startFinishLine && (
        <path
          key="start-finish-line"
          d={startFinishLine.path}
          transform={startFinishLine.transform}
          strokeWidth={trackLineWidth * 0.5}
          stroke={startFinishLineColor}
        />
      )}

      {sectorIndicators}
      {driverIndicators}
    </svg>
  );
};

export default TrackMap;
