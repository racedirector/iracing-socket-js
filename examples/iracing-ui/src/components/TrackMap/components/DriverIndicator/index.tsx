import React, { useImperativeHandle, useRef, useCallback } from "react";

export interface DriverIndicatorRef {
  setOffTrack: () => void;
  setOnTrack: () => void;
  setInPits: () => void;
  setCoordinates: (x: number, y: number) => void;
}

export interface DriverIndicatorProps extends React.SVGProps<SVGGElement> {
  classColor: string;
  carNumber: string;
  highlightWidth?: number;
}

const DriverIndicatorRFC: React.ForwardRefRenderFunction<
  DriverIndicatorRef,
  DriverIndicatorProps
> = ({ carNumber, classColor, highlightWidth = 4, ...props }, ref) => {
  const driverCircleRef = useRef<SVGCircleElement>(null);

  const setOffTrackCallback = useCallback(() => {
    if (driverCircleRef.current) {
      driverCircleRef.current.setAttribute(
        "stroke-width",
        highlightWidth.toString(),
      );

      driverCircleRef.current.setAttribute("stroke", "red");
    }
  }, [highlightWidth]);

  const setOnTrackCallback = useCallback(() => {
    if (driverCircleRef.current) {
      driverCircleRef.current.setAttribute("opacity", "1.0");
      driverCircleRef.current.setAttribute("stroke-width", "0");
    }
  }, [driverCircleRef]);

  const setInPitsCallback = useCallback(() => {
    if (driverCircleRef.current) {
      driverCircleRef.current.setAttribute("opacity", "0.5");
    }
  }, [driverCircleRef]);

  const setCoordinatesCallback = useCallback(
    (x: number, y: number) => {
      if (driverCircleRef.current) {
        driverCircleRef.current.setAttribute(
          "transform",
          `translate(${x} ${y})`,
        );
      }
    },
    [driverCircleRef],
  );

  useImperativeHandle(ref, () => ({
    setOffTrack: setOffTrackCallback,
    setOnTrack: setOnTrackCallback,
    setInPits: setInPitsCallback,
    setCoordinates: setCoordinatesCallback,
  }));

  return (
    <g {...props}>
      <circle
        ref={driverCircleRef}
        r={"10"}
        fill={classColor}
        strokeWidth={0}
        stroke={"#4DFF51"}
      />
      <text fill="black">{carNumber}</text>
    </g>
  );
};

export const DriverIndicator = React.forwardRef(DriverIndicatorRFC);
export default DriverIndicator;
