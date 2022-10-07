import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import { GAP, getLineAngle, getLinePath } from "../../utils";

export interface TrackPathRef {
  coordinatesForPercentage: (percentage: number) => { x: number; y: number };
  getViewBox: () => string;
}

interface TrackPathIndicator {
  lapPercentage: number;
}

interface SectorIndicator {
  path: string;
  transform: string;
}

export interface TrackPathProps {
  trackPath: string;
  trackPathWidth: number;
  trackPathColor: string;

  pitLanePath?: string;
  extendedTrackPath?: string;

  drawPathOutline?: boolean;

  drawStartFinishLine?: boolean;
  startFinishLineWidth?: number;
  startFinishLineColor?: string;

  sectors?: TrackPathIndicator[];
  sectorLineWidth?: number;
  sectorLineColor?: string;
}

const TrackPathRFC: React.ForwardRefRenderFunction<
  TrackPathRef,
  TrackPathProps
> = (
  {
    trackPath,
    trackPathColor,
    trackPathWidth,
    pitLanePath,
    drawStartFinishLine = false,
    startFinishLineWidth = trackPathWidth / 2,
    startFinishLineColor = "red",
    sectorLineWidth = trackPathWidth / 2,
    sectorLineColor = "yellow",
    sectors = [],
  },
  ref,
) => {
  const trackPathRef = useRef<SVGPathElement>(null);
  const [trackBoundingBox, setTrackBoundingBox] = useState(null);
  const [startFinishLine, setStartFinishLine] = useState<SectorIndicator>(null);
  const [sectorIndicatorPaths, setSectorIndicatorPaths] = useState<
    SectorIndicator[]
  >([]);

  const coordinatesForPercentageCallback = useCallback(() => {
    if (trackPathRef.current) {
      const trackPathLength = trackPathRef.current.getTotalLength();
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getViewBox: () => {
        if (trackPathRef.current) {
          console.log(trackPathRef.current);
          const trackDimensions = trackPathRef.current.getBBox();
          const largestRadius = startFinishLineWidth / 2;
          const constant = largestRadius + GAP;

          return `${trackDimensions.x - constant} ${
            trackDimensions.y - constant
          } ${trackDimensions.width + constant * 2} ${
            trackDimensions.height + constant * 2
          }`;
        }

        return null;
      },
      coordinatesForPercentage: () => ({ x: 0, y: 0 }),
    }),
    [startFinishLineWidth],
  );

  useEffect(() => {
    if (trackPathRef.current && drawStartFinishLine) {
      const startCoordinates = trackPathRef.current.getPointAtLength(0.0);
      const pathAngle = trackPathRef.current.getPointAtLength(0.1);

      const rotateAngle = getLineAngle(
        startCoordinates.x,
        startCoordinates.y,
        pathAngle.x,
        pathAngle.y,
      );

      const halfWidth = startFinishLineWidth / 2;

      setStartFinishLine({
        path: getLinePath(
          startCoordinates.x,
          startCoordinates.y - halfWidth,
          startCoordinates.x,
          startCoordinates.y + halfWidth,
        ),
        transform: `rotate(${rotateAngle} ${startCoordinates.x} ${startCoordinates.y})`,
      });
    }
  }, [trackPathRef, drawStartFinishLine, startFinishLineWidth]);

  useEffect(() => {
    if (trackPathRef.current) {
      const currentTrackPathLength = trackPathRef.current.getTotalLength();
      const halfWidth = sectorLineWidth / 2;
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

      setSectorIndicatorPaths(sectorPaths);
    }
  }, [sectorLineWidth, sectors]);

  const sectorIndicators = useMemo(
    () =>
      sectorIndicatorPaths.map(({ path, transform }, index) => (
        <path
          key={`sector-${index.toString()}`}
          d={path}
          transform={transform}
          strokeWidth={sectorLineWidth}
          stroke={sectorLineColor}
        />
      )),
    [sectorIndicatorPaths, sectorLineColor, sectorLineWidth],
  );

  return (
    <>
      <g fill="none" fillOpacity={0}>
        {trackPath && (
          <>
            <path
              key="track-outline"
              d={trackPath}
              stroke={"#FFFFFF"}
              strokeWidth={trackPathWidth * 1.8}
              strokeOpacity={0.3}
            />
            <path
              key="track"
              ref={trackPathRef}
              d={trackPath}
              stroke={trackPathColor}
              strokeWidth={trackPathWidth}
            />
          </>
        )}
        {pitLanePath && (
          <>
            <path
              key="pit-outline"
              d={pitLanePath}
              stroke={"#FFFFFF"}
              strokeWidth={trackPathWidth * 1.5}
            />
            <path
              key="pit"
              d={pitLanePath}
              stroke={trackPathColor}
              strokeWidth={trackPathWidth * 0.7}
            />
          </>
        )}
      </g>

      {startFinishLine && (
        <path
          key="start-finish-line"
          d={startFinishLine.path}
          transform={startFinishLine.transform}
          strokeWidth={trackPathWidth * 0.5}
          stroke={startFinishLineColor}
        />
      )}

      {sectorIndicators}
    </>
  );
};

export const TrackPath = React.forwardRef(TrackPathRFC);
export default TrackPath;
