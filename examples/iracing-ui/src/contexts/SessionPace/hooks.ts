import { useContext, useMemo } from "react";
import { useCurrentDriver } from "@racedirector/iracing-socket-js";
import { invariant } from "ts-invariant";
import { getPaceContext } from "./context";

export const usePace = () => {
  const context = useContext(getPaceContext());
  invariant(!!context, "Wrap the root component in an <PaceProvider>");
  return context;
};

export const usePaceIndex = () => {
  const { index } = usePace();
  return index;
};

export const useTopClassPace = () => {
  const { topClassId, index: paceIndex } = usePace();
  return useMemo(() => paceIndex?.[topClassId], [paceIndex, topClassId]);
};

export const useCurrentDriverClassPace = () => {
  const paceIndex = usePaceIndex();
  const { CarClassID = null } = useCurrentDriver() || {};
  return useMemo(() => {
    return paceIndex?.[CarClassID];
  }, [CarClassID, paceIndex]);
};
