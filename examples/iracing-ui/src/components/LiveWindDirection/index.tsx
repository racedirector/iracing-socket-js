import React from "react";
import { metersPerSecondToKilometersPerHour } from "../../utils";
import styles from "./styles";

export interface LiveWindDirectionProps {
  direction: number;
  velocity: number;
}

export const LiveWindDirection: React.FC<LiveWindDirectionProps> = ({
  direction,
  velocity,
}) => (
  <div style={styles.container}>
    <h3>Live Wind</h3>
    {/* <div style={styles.windDirection}>
      <div style={styles.needle} />
    </div> */}
    <p>{`Direction: ${direction.toFixed(2)}`}</p>
    <p>{`Velocity: ${velocity.toFixed(
      2,
    )} m/s (${metersPerSecondToKilometersPerHour(velocity).toFixed(
      2,
    )} km/h)`}</p>
  </div>
);

export default LiveWindDirection;
