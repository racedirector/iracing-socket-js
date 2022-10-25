import { useIRacingContext } from "@racedirector/iracing-socket-js";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { useAppSelector } from "src/app/hooks";
import { selectAverageRefuelAmount } from "src/features/fuelSlice";
import { useRaceLength } from "../RaceLength";
import { getRaceStrategyContext } from "./context";

export interface RaceStrategyProviderProps {}

export const RaceStrategyProvider: React.FC<
  PropsWithChildren<RaceStrategyProviderProps>
> = ({ children = null }) => {
  const RaceStrategyContext = getRaceStrategyContext();
  const { data: { DriverInfo: { DriverCarFuelMaxLtr } = {} } = {} } =
    useIRacingContext();

  const { lapsRemaining } = useRaceLength();
  const averageFuelCalculation = useAppSelector(
    selectAverageRefuelAmount(lapsRemaining),
  );

  // console.log("Need to put in", averageFuelCalculation, "more fuel");
  // console.log(DriverCarFuelMaxLtr, "L is what the car holds");

  const estimatedFuelStintsRemaining = useMemo(() => {
    const estimated = averageFuelCalculation / DriverCarFuelMaxLtr;
    return estimated;
  }, [averageFuelCalculation, DriverCarFuelMaxLtr]);

  return (
    <RaceStrategyContext.Provider value={{}}>
      {children}
    </RaceStrategyContext.Provider>
  );
};

export default RaceStrategyProvider;
