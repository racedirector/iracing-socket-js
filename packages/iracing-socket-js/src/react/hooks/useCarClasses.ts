import { chain } from "lodash";
import { useMemo } from "react";
import { useDriversByCarIndex } from "./useDrivers";

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
  const driverIndex = useDriversByCarIndex({
    includePaceCar: false,
    includeSpectators: false,
  });

  const classes = useMemo<Record<number, CarClassDetail>>(() => {
    const index = Object.values(driverIndex).reduce(
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
  }, [driverIndex]);

  return classes;
};

export const useBoPAdjustments = () => {
  const driversIndex = useDriversByCarIndex({
    includePaceCar: false,
    includeSpectators: false,
  });

  const adjustments = useMemo(() => {
    return chain(Object.values(driversIndex))
      .keyBy("CarID")
      .map(
        ({
          CarID,
          CarClassID,
          CarScreenName,
          CarScreenNameShort,
          CarClassMaxFuelPct,
          CarClassPowerAdjust,
        }) => ({
          carId: CarID,
          classId: CarClassID,
          screenName: CarScreenName,
          screenNameShort: CarScreenNameShort,
          maxFuelPercentage: parseInt(CarClassMaxFuelPct),
          powerAdjustment: CarClassPowerAdjust,
        }),
      )
      .valueOf();
  }, [driversIndex]);

  return adjustments;
};

export default useCarClasses;
