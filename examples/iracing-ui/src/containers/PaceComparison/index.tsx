import {
  selectDriverForIndex,
  selectIsTeamRacing,
  selectResultForCarIndex,
} from "@racedirector/iracing-socket-js";
import { createSelector } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useCallback } from "react";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { selectAverageLapTimeForTarget } from "src/features/paceAnalysisSlice";
import {
  PaceComparison as PaceComparisonUI,
  PaceComparisonDetailsProps,
} from "../../components/PaceComparison";
import ActiveDriversMenu from "../ActiveDriversMenu";

const selectTargetPace = createSelector(
  [
    (state: RootState) => selectIsTeamRacing(state.iRacing),
    (state: RootState, carIndex: number) =>
      selectDriverForIndex(state.iRacing, carIndex),
    (state: RootState, carIndex: number) =>
      selectAverageLapTimeForTarget(state, carIndex.toString()),
    (state: RootState, carIndex: number) =>
      state.iRacing.data?.CarIdxLastLapTime?.[carIndex],
    (state: RootState, carIndex: number) =>
      state.iRacing.data?.CarIdxBestLapTime?.[carIndex],
  ],
  (
    isTeamRacing,
    driver,
    averageLapTime,
    lastLapTime,
    bestLapTime,
  ): PaceComparisonDetailsProps => {
    return {
      averageLapTime,
      lastLapTime,
      bestLapTime,
      currentDriver: driver?.UserName,
      teamName: isTeamRacing ? driver?.TeamName : undefined,
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
  compareIndexes: comapreIndexesProp,
}) => {
  const [targetIndex, setTargetIndex] = useState<number>(targetIndexProp);
  const [compareIndexes, setCompareIndexes] =
    useState<number[]>(comapreIndexesProp);

  const target = useAppSelector((state) =>
    selectTargetPace(state, targetIndex),
  );

  const comparisons = useAppSelector((state) =>
    selectPaceForTargets(state, compareIndexes),
  );

  const onTargetChangeCallback = useCallback(
    (value) => {
      if (typeof value === "string") {
        setTargetIndex(parseInt(value));
      }
    },
    [setTargetIndex],
  );

  const onComparisonChangeCallback = useCallback(
    (value) => {
      if (Array.isArray(value)) {
        setCompareIndexes(value);
      }
    },
    [setCompareIndexes],
  );

  return (
    <>
      <PaceComparisonUI target={target} comparisons={comparisons} />

      <>
        <ActiveDriversMenu
          title="Set target"
          colorScheme="red"
          onDriverSelect={onTargetChangeCallback}
        />

        <ActiveDriversMenu
          title="Select comparisons"
          colorScheme="blue"
          selectionType="checkbox"
          closeOnSelect={false}
          onDriverSelect={onComparisonChangeCallback}
        />
      </>
    </>
  );
};

export default PaceComparison;
