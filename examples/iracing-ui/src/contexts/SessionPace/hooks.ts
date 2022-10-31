import { useContext, useMemo } from "react";
import { useCurrentDriver } from "@racedirector/iracing-socket-js";
import { invariant } from "ts-invariant";
import { getPaceContext } from "./context";
import { useAppSelector } from "src/app/hooks";
import {
  selectOtherClasses,
  selectClassById,
  selectTopClass,
} from "src/features/sessionPaceSlice";

export const usePace = () => {
  const context = useContext(getPaceContext());
  invariant(!!context, "Wrap the root component in an <PaceProvider>");
  return context;
};

export const usePaceIndex = () => {
  const { classPace } = usePace();
  return classPace;
};

export const useTopClassPace = () => useAppSelector(selectTopClass);

export const useCurrentDriverClassPace = () => {
  const { CarClassID = null } = useCurrentDriver() || {};
  return useAppSelector((state) =>
    selectClassById(state, CarClassID.toString()),
  );
};

export const useTopClassAndOtherClasses = () => {
  const topClass = useAppSelector(selectTopClass);
  const otherClasses = useAppSelector(selectOtherClasses);
  return useMemo(() => [topClass, otherClasses], [topClass, otherClasses]);
};
