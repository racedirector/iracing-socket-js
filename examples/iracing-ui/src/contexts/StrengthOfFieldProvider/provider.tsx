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

  const strengthOfField = useMemo(() => {
    return chain(Object.values(driverIndex))
      .groupBy("CarClassShortName")
      .mapValues((drivers) => {
        const totalStrengthOfField = drivers.reduce(
          (totalIRating, { IRating }) =>
            totalIRating + Math.pow(2, -IRating / MAGIC_NUMBER),
          0,
        );

        const strengthOfField =
          (MAGIC_NUMBER / Math.log(2)) *
          Math.log(drivers.length / totalStrengthOfField);
        return strengthOfField / 1000;
      })
      .valueOf();
  }, [driverIndex]);

  return (
    <StrengthOfFieldContext.Provider
      value={{
        strengthOfField,
      }}
    >
      {children}
    </StrengthOfFieldContext.Provider>
  );
};

export default StrengthOfFieldProvider;
