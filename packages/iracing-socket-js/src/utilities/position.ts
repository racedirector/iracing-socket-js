export interface PositionData {
  Position: number;
  FastestTime: number;
  ClassPosition: number;
  CarIdx: number;
}

export const expectedRaceLengthForPositionData = (
  raceLength: number,
  positions: PositionData[],
  carIndexesInClass: number[],
): number => {
  let raceLeaderLapTime = -1;
  let expectedLapCount = -1;

  for (const data of positions) {
    const {
      Position: position,
      ClassPosition: classPosition,
      FastestTime: fastestTime,
      CarIdx: carIndex,
    } = data;

    if (position === 0 && fastestTime > 0) {
      raceLeaderLapTime = fastestTime;
    }

    if (
      classPosition === 0 &&
      fastestTime > 0 &&
      carIndexesInClass.includes(carIndex)
    ) {
      if (position !== 0 && raceLeaderLapTime > 0) {
        expectedLapCount =
          (Math.ceil(raceLength / raceLeaderLapTime) * raceLeaderLapTime) /
          fastestTime;
      } else {
        expectedLapCount = raceLength / fastestTime;
      }

      break;
    }
  }

  return expectedLapCount;
};
