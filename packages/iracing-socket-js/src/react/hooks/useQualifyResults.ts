import { useMemo } from "react";
import { QualifyResultsInfoResult } from "../../types";
import { expectedRaceLengthForPositionData } from "../../utilities";
import { useIRacingContext } from "../context";
import { useDriverIndexesByClass } from "./useDrivers";
import { useDriversInCurrentDriverClass } from "./useDriver";
import { useRaceSession, useSessionSessionTime } from "./useSession";

export type UseQualifyResultsHook = () => QualifyResultsInfoResult[];

export const useQualifyResults: UseQualifyResultsHook = () => {
  const { data: { QualifyResultsInfo: { Results: results = [] } = {} } = {} } =
    useIRacingContext();
  return results;
};

export type UseQualifyResultsByClassHook = () => Record<
  string,
  QualifyResultsInfoResult[]
>;

export const useQualifyResultsByClass: UseQualifyResultsByClassHook = () => {
  const results = useQualifyResults();
  const drivers = useDriverIndexesByClass();

  return useMemo(
    () =>
      Object.entries(drivers).reduce((index, [classId, driverIndexes]) => {
        return {
          ...index,
          [classId]: results.filter(({ CarIdx }) =>
            driverIndexes.includes(CarIdx),
          ),
        };
      }, {}),
    [results, drivers],
  );
};

export type UseQualifyResultsExpectedRaceLengthHook = () => number | null;

export const useQualifyResultsExpectedRaceLength: UseQualifyResultsExpectedRaceLengthHook =
  () => {
    const session = useRaceSession();
    const raceSessionLength = useSessionSessionTime(session);
    const results = useQualifyResults();
    const driverIndexesInClass = useDriversInCurrentDriverClass();

    return useMemo(() => {
      if (raceSessionLength > 0) {
        return expectedRaceLengthForPositionData(
          raceSessionLength,
          results,
          driverIndexesInClass,
        );
      }

      return null;
    }, [raceSessionLength, results, driverIndexesInClass]);
  };
