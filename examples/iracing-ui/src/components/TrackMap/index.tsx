import React, { useEffect, useState, useRef, useCallback } from "react";
import tracks from "./tracks.json";

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

export interface TrackMapProps {
  trackId: number;
  drawSectorLines: boolean;
  indicators: TrackMapIndicator[];
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
  const [sectorLinePaths, setSectorLinePaths] = useState([]);
  const [startFinishLinePath, setStartFinishLinePath] = useState(null);

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

      setStartFinishLinePath(
        `M ${startCoordinates.x} ${startCoordinates.y - halfWidth} L ${
          startCoordinates.x
        } ${startCoordinates.y + halfWidth}`,
      );
    },
    [trackPathRef],
  );

  const drawSectorLines = useCallback(() => {}, [trackPathRef]);

  useEffect(() => {
    if (trackPathRef.current) {
      drawStartFinishLine(0);

      if (shouldDrawSectorLines) {
        drawSectorLines();
      }
    }
  }, [trackPathRef]);

  useEffect(() => {
    console.log(containerRef.current);
  }, [containerRef]);

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

      {startFinishLinePath && <path d={startFinishLinePath} />}
    </svg>
  );
};

export default TrackMap;
