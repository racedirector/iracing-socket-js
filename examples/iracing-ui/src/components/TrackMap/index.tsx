import { isEmpty } from "lodash";
import React, { useEffect, useState, useRef, useCallback } from "react";
import tracks from "./tracks.json";

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
  rotation: number;
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
  indicators = [],
  sectors = [],
  drawSectorLines: shouldDrawSectorLines = true,
  trackLineColor = "black",
  trackLineWidth = 10,
  startFinishLineWidth = trackLineWidth * 3,
  sectorLineWidth = trackLineWidth * 2,
  style,
}) => {
  const containerRef = useRef<SVGSVGElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const [paths, setPaths] = useState([]);
  const [sectorLinePaths, setSectorLinePaths] = useState<
    StartFinishLineIndicator[]
  >([]);
  const [
    { path: startFinishLinePath, rotation: startFinishLineRotation },
    setStartFinishLinePath,
  ] = useState<StartFinishLineIndicator>(null);

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
        rotation: rotateAngle,
      });
    },
    [trackPathRef],
  );

  const drawSectorLines = useCallback(() => {
    const halfWidth = sectorLineWidth / 2;
    const currentTrackPathLength = trackPathRef.current.getTotalLength();

    sectors.map(({ lapPercentage }) => {
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
          rotation: sectorRotation,
        },
      ]);
    });
  }, [trackPathRef, sectors]);

  useEffect(() => {
    if (trackPathRef.current) {
      drawStartFinishLine(0);

      if (shouldDrawSectorLines) {
        drawSectorLines();
      }
    }
  }, [trackPathRef]);

  useEffect(() => {
    if (trackId && tracks[trackId]) {
      setPaths(tracks[trackId].paths);
    }
  }, [trackId]);

  return (
    <svg
      ref={containerRef}
      style={style}
      xmlns="<http://www.w3.org/2000/svg>"
      preserveAspectRatio="meet"
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
            viewBox={isTrackOutline ? "" : undefined}
          />
        );
      })}

      {startFinishLinePath && (
        <path d={startFinishLinePath} rotate={startFinishLineRotation} />
      )}

      {sectorLinePaths.map(({ path: pathString, rotation }) => (
        <path d={pathString} rotate={rotation} />
      ))}
    </svg>
  );
};

export default TrackMap;
