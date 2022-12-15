import { useContext } from "react";
import { useAppSelector } from "src/app/hooks";
import {
  selectAverageRefuelAmount,
  selectLastLapRefuelAmount,
} from "src/features/fuelSlice";
import { useLapsRemainingForCurrentDriver } from "src/hooks/useRaceLength";
import invariant from "ts-invariant";
import { getFuelContext } from "./context";

export const useFuel = () => {
  const context = useContext(getFuelContext());
  invariant(!!context, "Wrap the root component in an <FuelProvider>");
  return context;
};

// export const useAverageRefuelAmount = () => {
//   const lapsRemaining = useLapsRemainingForCurrentDriver();
//   const averageRefuelAmount = useAppSelector((state) =>
//     selectAverageRefuelAmount(state, lapsRemaining),
//   );

//   return averageRefuelAmount;
// };

// export const useLastRefuelAmount = () => {
//   const lapsRemaining = useLapsRemainingForCurrentDriver();
//   const lastRefuelAmount = useAppSelector((state) =>
//     selectLastLapRefuelAmount(state, lapsRemaining),
//   );

//   return lastRefuelAmount;
// };
