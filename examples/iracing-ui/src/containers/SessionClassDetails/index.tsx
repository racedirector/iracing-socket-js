import React, { useMemo, useEffect } from "react";
import {
  useCarClasses,
  useCurrentSessionClassFastestLap,
  useDriversByCarClass,
} from "@racedirector/iracing-socket-js";
import { SessionClassDetailsCardProps } from "src/components/SessionClassDetailsCard";
import { SessionClassDetails as SessionClassDetailsUI } from "../../components/SessionClassDetails";
import { useStrengthOfFieldContext } from "src/contexts/StrengthOfField";
import { useRaceLength } from "src/contexts/RaceLength";
import { useAppSelector } from "src/app/hooks";
import { selectAveragePace } from "src/features/sessionPaceSlice";
import { selectAverageLapTimesForTargetsByClass } from "src/features/paceAnalysisSlice";

export interface SessionClassDetailsProps {}

export const SessionClassDetails: React.FC<SessionClassDetailsProps> = () => {
  const carClasses = useCarClasses();
  const { isRaceTimed, raceLaps, lapsComplete, estimatedLaps } =
    useRaceLength();
  const { strengthOfField } = useStrengthOfFieldContext();
  const fastestLapIndex = useCurrentSessionClassFastestLap();

  const leaderPaceIndex = useAppSelector(selectAveragePace);
  const drivers = useDriversByCarClass({
    includeAI: false,
    includePaceCar: false,
    includeSpectators: false,
  });

  const driverIndexesByClassId = useMemo(
    () =>
      Object.entries(drivers).reduce(
        (index, [classId, drivers]) => ({
          ...index,
          [classId]: drivers.map(({ CarIdx }) => CarIdx),
        }),
        {},
      ),
    [drivers],
  );

  const averagePaceByClass = useAppSelector((state) =>
    selectAverageLapTimesForTargetsByClass(state, driverIndexesByClassId),
  );

  const classDetails = useMemo(() => {
    return Object.values(carClasses).map<SessionClassDetailsCardProps>(
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
    carClasses,
    estimatedLaps,
    fastestLapIndex,
    isRaceTimed,
    lapsComplete,
    leaderPaceIndex,
    raceLaps,
    strengthOfField,
  ]);

  useEffect(() => {
    console.log("Got new class details:", classDetails);
  }, [classDetails]);

  return <SessionClassDetailsUI classDetails={classDetails} />;
};
