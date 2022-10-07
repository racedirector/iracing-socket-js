import { useEffect, useMemo, useState } from "react";
import { useIRacingContext } from "../context";

export interface CarClassDetail {
  id: string;
  color: number;
  dryTireSetLimit: string;
  estimatedLapTime: number;
  licenseLevel: number;
  maxFuelPercentage: number;
  powerAdjustment: string;
  relativeSpeed: number;
  shortName: string;
  weightPenalty: string;
}

export const useCarClasses: () => Record<number, CarClassDetail> = () => {
  const { data: { DriverInfo: { Drivers: results = [] } = {} } = {} } =
    useIRacingContext();

  const classes = useMemo<Record<number, CarClassDetail>>(() => {
    const index = results
      .filter(({ CarIsPaceCar }) => !CarIsPaceCar)
      .reduce(
        (
          index,
          {
            CarClassID,
            CarClassColor,
            CarClassDryTireSetLimit,
            CarClassEstLapTime,
            CarClassLicenseLevel,
            CarClassMaxFuelPct,
            CarClassPowerAdjust,
            CarClassRelSpeed,
            CarClassShortName,
            CarClassWeightPenalty,
          },
        ) => {
          if (!index[CarClassID]) {
            index[CarClassID] = {
              id: CarClassID.toString(),
              color: CarClassColor,
              dryTireSetLimit: CarClassDryTireSetLimit,
              estimatedLapTime: CarClassEstLapTime,
              licenseLevel: CarClassLicenseLevel,
              maxFuelPercentage: parseInt(CarClassMaxFuelPct),
              powerAdjustment: CarClassPowerAdjust,
              relativeSpeed: CarClassRelSpeed,
              shortName: CarClassShortName,
              weightPenalty: CarClassWeightPenalty,
            };
          }

          return index;
        },
        {},
      );

    return index;
  }, [results]);

  return classes;
};

export const useIsMulticlass: () => boolean = () => {
  const [isMulticlass, setIsMulticlass] = useState(null);
  const carClasses = useCarClasses();

  useEffect(() => {
    const classCount = Object.keys(carClasses).length;
    const nextIsMulticlass = classCount > 1;
    if (isMulticlass !== nextIsMulticlass) {
      setIsMulticlass(nextIsMulticlass);
    }
  }, [carClasses, isMulticlass]);

  return isMulticlass;
};

export default useCarClasses;
