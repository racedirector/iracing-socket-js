import { useMemo } from "react";
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

export const useCarClasses: () => CarClassDetail[] = () => {
  const { data: { DriverInfo: { Drivers: results = [] } = {} } = {} } =
    useIRacingContext();

  const classes = useMemo<CarClassDetail[]>(() => {
    console.log("Drivers did change from the top:", results);
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

    return Object.values(index);
  }, [results]);

  return classes;
};

export default useCarClasses;
