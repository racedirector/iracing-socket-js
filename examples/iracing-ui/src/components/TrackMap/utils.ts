export const GAP = 1;

export const getLinePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) => {
  return `M${startX} ${startY} L${endX} ${endY}`;
};

export const getLineAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => {
  const x = x1 - x2;
  const y = y1 - y2;

  if (!x && !y) {
    return 0;
  }

  return (180 + (Math.atan2(-y, -x) * 180) / Math.PI + 360) % 360;
};
