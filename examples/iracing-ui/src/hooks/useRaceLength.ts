import { useAppSelector } from "src/app/hooks";
import {
  selectEstimatedLapsForCurrentDriverClass,
  selectLapsCompleteForCurrentDriverClass,
  selectLapsRemainingForCurrentDriver,
  selectLapsRemainingForCurrentDriverClass,
  selectRaceLengthContext,
} from "src/features/sessionPaceSlice";

export const useRaceLength = () => useAppSelector(selectRaceLengthContext);

export const useLapsRemainingForCurrentDriverClass = () =>
  useAppSelector(selectLapsRemainingForCurrentDriverClass);

export const useLapsRemainingForCurrentDriver = () =>
  useAppSelector(selectLapsRemainingForCurrentDriver);

export const useLapsCompleteForCurrentDriverClass = () =>
  useAppSelector(selectLapsCompleteForCurrentDriverClass);

export const useEstimatedLapsForCurrentDriverClass = () =>
  useAppSelector(selectEstimatedLapsForCurrentDriverClass);
