import React, { useMemo, useEffect } from "react";
import {
  selectActiveDriversByCarClass,
  selectStrengthOfFieldByClass,
  useCurrentSessionClassFastestLap,
} from "@racedirector/iracing-socket-js";
import { SessionClassDetailsCardProps } from "src/components/SessionClassDetailsCard";
import { SessionClassDetails as SessionClassDetailsUI } from "../../components/SessionClassDetails";
import { useRaceLength } from "src/contexts/RaceLength/hooks";
import { useAppSelector } from "src/app/hooks";
import { selectAveragePace } from "src/features/sessionPaceSlice";
import { selectAverageLapTimesForTargetsByClass } from "src/features/paceAnalysisSlice";
import { chain } from "lodash";

export interface ClassDetail {
  id: string;
  color: number;
  shortName: string;
}

export interface SessionClassDetailsProps {}

export const SessionClassDetails: React.FC<SessionClassDetailsProps> = () => {
  const { isRaceTimed, raceLaps, lapsComplete, estimatedLaps } =
    useRaceLength();
  const activeDrivers = useAppSelector((state) =>
    selectActiveDriversByCarClass(state.iRacing, {
      includePaceCar: false,
      includeSpectators: false,
    }),
  );

  const classes = useMemo<Record<number, ClassDetail>>(() => {
    const index = chain(Object.values(activeDrivers))
      .flatten()
      .reduce((index, { CarClassID, CarClassColor, CarClassShortName }) => {
        if (!index[CarClassID]) {
          index[CarClassID] = {
            id: CarClassID.toString(),
            color: CarClassColor,
            shortName: CarClassShortName,
          };
        }

        return index;
      }, {})
      .valueOf();

    return index;
  }, [activeDrivers]);

  const strengthOfField = useAppSelector((state) =>
    selectStrengthOfFieldByClass(state.iRacing),
  );
  const fastestLapIndex = useCurrentSessionClassFastestLap();

  const leaderPaceIndex = useAppSelector(selectAveragePace);

  const driverIndexesByClassId = useMemo(
    () =>
      Object.entries(activeDrivers).reduce(
        (index, [classId, drivers]) => ({
          ...index,
          [classId]: drivers.map(({ CarIdx }) => CarIdx),
        }),
        {},
      ),
    [activeDrivers],
  );

  const averagePaceByClass = useAppSelector((state) =>
    selectAverageLapTimesForTargetsByClass(state, driverIndexesByClassId),
  );

  const classDetails = useMemo(() => {
    return Object.values(classes).map<SessionClassDetailsCardProps>(
      ({ color, shortName, id }) => ({
        color: `#${color.toString(16)}`,
        className: shortName,
        strengthOfField: strengthOfField?.[id] || 0,
        lapsCompleted: lapsComplete?.[id],
        totalLaps: raceLaps || estimatedLaps?.[id] || 0,
        raceLaps: raceLaps,
        estimated: isRaceTimed,
        fastestLap: fastestLapIndex?.[id] || 0,
        leaderPace: leaderPaceIndex?.[id] || 0,
        fieldPace: averagePaceByClass?.[id] || 0,
      }),
    );
  }, [
    averagePaceByClass,
    classes,
    estimatedLaps,
    fastestLapIndex,
    isRaceTimed,
    lapsComplete,
    leaderPaceIndex,
    raceLaps,
    strengthOfField,
  ]);

  return <SessionClassDetailsUI classDetails={classDetails} />;
};
