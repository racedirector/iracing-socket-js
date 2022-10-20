import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { useMemo } from "react";

export const useFuelUnit = () => {
  const { data: { DisplayUnits: displayUnits } = {} } = useIRacingContext();
  return useMemo(() => (displayUnits ? "L" : "g"), [displayUnits]);
};
