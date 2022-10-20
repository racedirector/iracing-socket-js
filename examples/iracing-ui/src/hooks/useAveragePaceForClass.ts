import { useMemo } from "react";
import {
  useCurrentDriver,
  useCurrentSessionIsRaceSession,
} from "@racedirector/iracing-socket-js";
import { isEmpty, omit } from "lodash";
import { usePace, usePaceIndex } from "src/contexts/SessionPace";

type UseTotalLapsByClassHook = () => Record<string, number>;

export const useTotalLapsByClass: UseTotalLapsByClassHook = () => {
  const { topClassId, index: paceIndex } = usePace();
  const isRaceSession = useCurrentSessionIsRaceSession();

  return useMemo(() => {
    if (isEmpty(paceIndex) || !isRaceSession) {
      return null;
    }

    const topClass = paceIndex[topClassId];
    const lapsRemaining =
      topClass.lapsComplete +
      Math.max(1, topClass.sessionTimeRemaining) / topClass.averageLapTime;

    const roundedLaps = Math.round(lapsRemaining + 0.5);

    const lapsRemainingIndex: Record<string, number> = {
      [topClassId]: roundedLaps,
    };

    const otherClasses = omit(paceIndex, topClassId);

    // If there are no other classes, return the index as-is
    if (isEmpty(otherClasses)) {
      return lapsRemainingIndex;
    } else {
      return Object.keys(otherClasses).reduce((index, classId) => {
        const classPace = paceIndex[classId];
        const timeRemainingDifference =
          topClass.sessionTimeRemaining - classPace.sessionTimeRemaining;
        const timeRemainingOffset = Math.max(
          1,
          topClass.sessionTimeRemaining - timeRemainingDifference,
        );
        const classLapsRemaining =
          classPace.lapsComplete +
          timeRemainingOffset / classPace.averageLapTime;

        return {
          ...index,
          [classId]: Math.round(classLapsRemaining + 0.5),
        };
      }, lapsRemainingIndex);
    }
  }, [isRaceSession, paceIndex, topClassId]);
};

type UseRemainingLapsByClassHook = () => Record<string, number>;

export const useRemainingLapsByClass: UseRemainingLapsByClassHook = () => {
  const paceIndex = usePaceIndex();
  const totalLapsIndex = useTotalLapsByClass();

  const remainingLapsIndex = useMemo(() => {
    if (isEmpty(paceIndex) || isEmpty(totalLapsIndex)) {
      return null;
    }

    return Object.entries(paceIndex).reduce((index, [classId, classPace]) => {
      const totalLaps = totalLapsIndex[classId];
      const remainingLaps = totalLaps - classPace.lapsComplete;

      return {
        ...index,
        [classId]: remainingLaps,
      };
    }, {});
  }, [paceIndex, totalLapsIndex]);

  return remainingLapsIndex;
};

type UseTotalLapsForCurrentDriverClassHook = () => number;

export const useTotalLapsForCurrentDriverClass: UseTotalLapsForCurrentDriverClassHook =
  () => {
    const totalLapsIndex = useTotalLapsByClass();
    const { CarClassID = null } = useCurrentDriver() || {};
    return useMemo(() => {
      return totalLapsIndex?.[CarClassID] || -1;
    }, [totalLapsIndex, CarClassID]);
  };

type UseRemainingLapsForCurrentDriverClassHook = () => number;

export const useRemainingLapsForCurrentDriverClass: UseRemainingLapsForCurrentDriverClassHook =
  () => {
    const remainingLapsIndex = useRemainingLapsByClass();
    const { CarClassID = null } = useCurrentDriver() || {};
    return useMemo(() => {
      return remainingLapsIndex?.[CarClassID] || -1;
    }, [remainingLapsIndex, CarClassID]);
  };
