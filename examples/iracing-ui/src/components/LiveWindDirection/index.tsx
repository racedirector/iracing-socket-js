import React from "react";
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
    <div style={styles.windDirection}>
      <div style={styles.needle} />
    </div>
    <p>{`Direction: ${direction}`}</p>
    <p>{`Velocity: ${velocity} km/h`}</p>
  </div>
);

export default LiveWindDirection;
