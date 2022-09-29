import React, { useEffect, useState, useRef, useCallback } from "react";
import tracks from "./tracks.json";

const GAP = 1;

const getLinePath = (startX, startY, endX, endY) => {
  return `M${startX} ${startY} L${endX} ${endY}`;
};

const getLineAngle = (x1, y1, x2, y2) => {
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

interface StartFinishLineIndicator {
  path: string;
  transform: string;
}

interface SectorIndicator extends TrackMapIndicator {}

export interface TrackMapProps {
  trackId: number;
  drawSectorLines: boolean;
  indicators: TrackMapIndicator[];
  sectors: SectorIndicator[];

  startFinishLineColor?: string;
  startFinishLineWidth?: number;
  sectorLineColor?: string;
  sectorLineWidth?: number;
  trackLineColor?: string;
  trackLineWidth?: number;
  drawTrackOutline?: boolean;
  trackOutlineColor?: string;
  style?: React.CSSProperties;
}

export const TrackMap: React.FC<TrackMapProps> = ({
  trackId,
  sectors = [],
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
  const [trackViewBox, setTrackViewBox] = useState("0 0 0 0");
  const [paths, setPaths] = useState([]);
  const [sectorLinePaths, setSectorLinePaths] = useState<
    StartFinishLineIndicator[]
  >([]);
  const [startFinishLine, setStartFinishLinePath] =
    useState<StartFinishLineIndicator>(null);

  const drawStartFinishLine = useCallback(
    (point) => {
      const currentTrackPathLength = trackPathRef.current.getTotalLength();

      const startCoordinates = trackPathRef.current.getPointAtLength(
        point * currentTrackPathLength,
      );

      const pathAngle = trackPathRef.current.getPointAtLength(
        point * currentTrackPathLength + 0.1,
      );

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
    },
    [startFinishLineWidth],
  );

  const drawSectorLines = useCallback(() => {
    const halfWidth = sectorLineWidth / 2;
    const currentTrackPathLength = trackPathRef.current.getTotalLength();

    sectors.forEach(({ lapPercentage }, index) => {
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

      setSectorLinePaths((paths) => [
        ...paths,
        {
          path: getLinePath(
            sectorCoordinates.x,
            sectorCoordinates.y - halfWidth,
            sectorCoordinates.x,
            sectorCoordinates.y + halfWidth,
          ),
          transform: `rotate(${sectorRotation} ${sectorCoordinates.x} ${sectorCoordinates.y})`,
        },
      ]);
    });
  }, [sectorLineWidth, sectors]);

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

      drawStartFinishLine(0);

      if (shouldDrawSectorLines) {
        console.log("Draw sector");
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

  return (
    <svg
      ref={containerRef}
      viewBox={trackViewBox}
      xmlns="<http://www.w3.org/2000/svg>"
    >
      {paths.map((pathString, index) => {
        const isTrackOutline = index === 0;

        return (
          <path
            key={isTrackOutline ? "track" : "pit"}
            ref={isTrackOutline ? trackPathRef : undefined}
            d={pathString}
            fill="none"
            fillOpacity={0}
            stroke={trackLineColor}
            strokeWidth={isTrackOutline ? trackLineWidth : trackLineWidth * 0.7}
          />
        );
      })}

      {startFinishLine && (
        <path
          d={startFinishLine.path}
          transform={startFinishLine.transform}
          strokeWidth={trackLineWidth * 0.5}
          stroke={startFinishLineColor}
        />
      )}

      {sectorLinePaths.map(({ path: pathString, transform }, index) => (
        <path
          key={`sector-${index}`}
          d={pathString}
          transform={transform}
          strokeWidth={trackLineWidth * 0.5}
          stroke={sectorLineColor}
        />
      ))}
    </svg>
  );
};

export default TrackMap;
