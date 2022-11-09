import React from "react";
import { chain } from "lodash";
import { createSelector } from "@reduxjs/toolkit";
import {
  selectActiveDriversByCarClass,
  selectCurrentSessionFastestLapByClass,
  selectStrengthOfFieldByClass,
} from "@racedirector/iracing-socket-js";
import { SessionClassDetailsCardProps } from "../../components/SessionClassDetailsCard";
import { SessionClassDetails as SessionClassDetailsUI } from "../../components/SessionClassDetails";
import { useAppSelector } from "../../app/hooks";
import {
  selectAveragePace,
  selectRaceLengthContext,
} from "../../features/sessionPaceSlice";
import { selectAverageLapTimesForTargetsByClass } from "../../features/paceAnalysisSlice";
import { RootState } from "../../app/store";

const selectActiveDrivers = ({ iRacing }: RootState) =>
  selectActiveDriversByCarClass(iRacing, {
    includePaceCar: false,
    includeSpectators: false,
  });

const selectActiveDriverIndexesByCarClass = createSelector(
  [selectActiveDrivers],
  (activeDrivers) => {
    return Object.entries(activeDrivers).reduce(
      (index, [classId, drivers]) => ({
        ...index,
        [classId]: drivers.map(({ CarIdx }) => CarIdx),
      }),
      {},
    );
  },
);

const selectAveragePaceByClass = (state: RootState) =>
  selectAverageLapTimesForTargetsByClass(
    state,
    selectActiveDriverIndexesByCarClass(state),
  );

const selectSessionClassDetails = createSelector(
  [
    selectRaceLengthContext,
    selectAveragePace,
    selectActiveDrivers,
    ({ iRacing }) => selectStrengthOfFieldByClass(iRacing),
    selectAveragePaceByClass,
    ({ iRacing }) => selectCurrentSessionFastestLapByClass(iRacing),
  ],
  (
    { lapsComplete, raceLaps, estimatedLaps, isRaceTimed },
    leaderPaceIndex,
    activeDrivers,
    strengthOfField,
    averagePaceByClass,
    fastestLapIndex,
  ) => {
    return chain(Object.values(activeDrivers))
      .flatten()
      .reduce<Record<string, SessionClassDetailsCardProps>>(
        (
          index,
          {
            CarClassID: classId,
            CarClassColor: classColor,
            CarClassShortName: classShortName,
          },
        ) => {
          if (!index[classId]) {
            index[classId] = {
              color: `#${classColor.toString(16)}`,
              className: classShortName,
              strengthOfField: strengthOfField?.[classId] || 0,
              lapsCompleted: lapsComplete?.[classId],
              totalLaps: raceLaps || estimatedLaps?.[classId] || 0,
              estimated: isRaceTimed,
              fastestLap: fastestLapIndex?.[classId] || 0,
              leaderPace: leaderPaceIndex?.[classId] || 0,
              fieldPace: averagePaceByClass?.[classId] || 0,
            };
          }

          return index;
        },
        {},
      )
      .values()
      .valueOf();
  },
);

export interface SessionClassDetailsProps {}

export const SessionClassDetails: React.FC<SessionClassDetailsProps> = () => {
  const classDetails = useAppSelector(selectSessionClassDetails);
  return <SessionClassDetailsUI classDetails={classDetails} />;
};
