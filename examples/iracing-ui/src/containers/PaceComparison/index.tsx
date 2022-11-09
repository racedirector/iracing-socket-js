import {
  selectDriverForIndex,
  selectResultForCarIndex,
} from "@racedirector/iracing-socket-js";
import { createSelector } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { selectAverageLapTimeForTarget } from "src/features/paceAnalysisSlice";
import {
  PaceComparison as PaceComparisonUI,
  PaceComparisonDetailsProps,
} from "../../components/PaceComparison";

const selectTargetPace = createSelector(
  [
    (state: RootState, carIndex: number) =>
      selectResultForCarIndex(state.iRacing, carIndex),
    (state: RootState, carIndex: number) =>
      selectDriverForIndex(state.iRacing, carIndex),
    (state: RootState, carIndex: number) =>
      selectAverageLapTimeForTarget(state, carIndex.toString()),
  ],
  (result, driver, averageLapTime): PaceComparisonDetailsProps => {
    return {
      averageLapTime,
      currentDriver: driver?.UserName,
      teamName: driver?.TeamName,
      lastLapTime: result?.LastTime,
      bestLapTime: result?.FastestTime,
    };
  },
);

const selectPaceForTargets = (state: RootState, targets: number[]) => {
  return targets.map((index) => selectTargetPace(state, index));
};

export interface PaceComparisonProps {
  targetIndex?: number;
  compareIndexes?: number[];
}

export const PaceComparison: React.FC<PaceComparisonProps> = ({
  targetIndex: targetIndexProp,
  compareIndexes = [1, 5, 32],
}) => {
  const [targetIndex, setTargetIndex] = useState<number>(targetIndexProp);
  const target = useAppSelector((state) =>
    selectTargetPace(state, targetIndex),
  );

  const comparisons = useAppSelector((state) =>
    selectPaceForTargets(state, compareIndexes),
  );

  return (
    <PaceComparisonUI
      target={target}
      comparisons={comparisons}
      onTargetChange={(carIndex) => setTargetIndex(parseInt(carIndex))}
    />
  );
};

export default PaceComparison;
