import { useIRacingContext } from "@racedirector/iracing-socket-js";
import { useContext, useMemo } from "react";
import { invariant } from "ts-invariant";
import { getFuelContext } from "../contexts/Fuel";

export const useFuel = () => {
  const context = useContext(getFuelContext());

  invariant(!!context, "Wrap the root component in an <FuelProvider>");

  return context;
};

export const useFuelUnit = () => {
  const { data: { DisplayUnits: displayUnits } = {} } = useIRacingContext();
  return useMemo(() => (displayUnits ? "L" : "g"), [displayUnits]);
};
