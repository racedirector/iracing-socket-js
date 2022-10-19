import { useMemo } from "react";
import { chain, CollectionChain } from "lodash";
import { useIRacingContext } from "../context";
import { Driver } from "../../types";

interface FilterDriversResults {
  includeAI: boolean;
  includePaceCar: boolean;
  includeSpectators: boolean;
}

const filterDrivers: (
  results: Driver[],
  filters: FilterDriversResults,
) => CollectionChain<Driver> = (
  results,
  { includeAI = true, includePaceCar = true, includeSpectators = true },
) => {
  return chain(results).filter(({ CarIsPaceCar, CarIsAI, IsSpectator }) => {
    if (!includeAI && CarIsAI) {
      return false;
    } else if (!includePaceCar && CarIsPaceCar) {
      return false;
    } else if (!includeSpectators && IsSpectator) {
      return false;
    }

    return true;
  });
};

export interface UseDriversByKeyProps extends FilterDriversResults {
  key: keyof Driver;
}

export const useDriversByKey: (
  props?: Partial<UseDriversByKeyProps>,
) => Record<number, Driver> = ({
  key,
  includeAI = true,
  includePaceCar = true,
  includeSpectators = true,
} = {}) => {
  const { data: { DriverInfo: { Drivers: results = [] } = {} } = {} } =
    useIRacingContext();
  const filters = useMemo<FilterDriversResults>(
    () => ({
      includeAI,
      includePaceCar,
      includeSpectators,
    }),
    [includeAI, includePaceCar, includeSpectators],
  );

  const index = useMemo(
    () => filterDrivers(results, filters).keyBy(key).valueOf(),
    [filters, key, results],
  );

  return index;
};

export const useDriversByGroup: (
  props?: Partial<UseDriversByKeyProps>,
) => Record<number, Driver[]> = ({
  key,
  includeAI = true,
  includePaceCar = true,
  includeSpectators = true,
} = {}) => {
  const { data: { DriverInfo: { Drivers: results = [] } = {} } = {} } =
    useIRacingContext();
  const filters = useMemo<FilterDriversResults>(
    () => ({
      includeAI,
      includePaceCar,
      includeSpectators,
    }),
    [includeAI, includePaceCar, includeSpectators],
  );

  const index = useMemo(
    () => filterDrivers(results, filters).groupBy(key).valueOf(),
    [filters, key, results],
  );

  return index;
};

export interface UseDriversByCarIndexProps extends FilterDriversResults {}

export const useDriversByCarIndex: (
  props?: Partial<UseDriversByCarIndexProps>,
) => Record<number, Driver> = (props) => {
  return useDriversByKey({
    ...props,
    key: "CarIdx",
  });
};

export interface UseDriversByCarClassProps extends FilterDriversResults {}

export const useDriversByCarClass: (
  props?: Partial<UseDriversByCarClassProps>,
) => Record<string, Driver[]> = (props) => {
  return useDriversByGroup({ ...props, key: "CarClassID" });
};

export interface UseDriversForCarClassProps extends FilterDriversResults {
  carClassId: string;
}

export const useDriversForClass: (
  props?: Partial<UseDriversForCarClassProps>,
) => Driver[] = ({ carClassId, ...filters }) => {
  const driverIndex = useDriversByCarClass(filters);
  return useMemo(
    () => driverIndex?.[carClassId] || [],
    [driverIndex, carClassId],
  );
};

type UseDriverIndexesByClassHook = () => Record<string, number[]>;

export const useDriverIndexesByClass: UseDriverIndexesByClassHook = () => {
  const drivers = useDriversByCarClass({
    includePaceCar: false,
    includeAI: false,
    includeSpectators: false,
  });

  return useMemo(
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
};
