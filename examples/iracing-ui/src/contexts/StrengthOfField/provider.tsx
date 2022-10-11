import React, { PropsWithChildren, useMemo } from "react";
import { chain } from "lodash";
import { useDriversByCarIndex } from "@racedirector/iracing-socket-js";
import { StrengthOfFieldContext } from "./context";

const MAGIC_NUMBER = 1600;

export interface StrengthOfFieldProviderProps {}

export const StrengthOfFieldProvider: React.FC<
  PropsWithChildren<StrengthOfFieldProviderProps>
> = ({ children = null }) => {
  const driverIndex = useDriversByCarIndex({
    includeSpectators: false,
    includePaceCar: false,
  });

  const strengthOfField: Record<string, number> = useMemo(() => {
    return chain(Object.values(driverIndex))
      .groupBy("CarClassShortName")
      .mapValues((drivers) => {
        const total = drivers.reduce(
          (totalIRating, { IRating }) =>
            totalIRating + Math.pow(2, -IRating / MAGIC_NUMBER),
          0,
        );

        const strength =
          (MAGIC_NUMBER / Math.log(2)) * Math.log(drivers.length / total);
        return strength / 1000;
      })
      .valueOf();
  }, [driverIndex]);

  const totalStrengthOfField: number = useMemo(() => {
    const numberOfClasses = Object.keys(strengthOfField).length;
    const total = Object.values(strengthOfField).reduce(
      (aggregation, iRating) => aggregation + iRating,
      0,
    );

    const strength =
      (MAGIC_NUMBER / Math.log(2)) * Math.log(numberOfClasses / total);

    return strength / 1000;
  }, [strengthOfField]);

  return (
    <StrengthOfFieldContext.Provider
      value={{
        totalStrengthOfField,
        strengthOfField,
      }}
    >
      {children}
    </StrengthOfFieldContext.Provider>
  );
};

export default StrengthOfFieldProvider;
