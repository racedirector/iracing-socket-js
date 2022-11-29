import React, { useCallback } from "react";
import {
  replaySearch,
  ReplaySearchCommand,
} from "@racedirector/iracing-socket-js";
import { useDispatch } from "react-redux";
import Stepper from "../../components/Stepper";

export interface ReplayLapStepperProps {}

export const ReplayLapStepper: React.FC<ReplayLapStepperProps> = () => {
  const dispatch = useDispatch();

  const nextLapCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.NextLap));
  }, [dispatch]);

  const previousLapCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.PreviousLap));
  }, [dispatch]);

  return (
    <Stepper
      title="Laps"
      decrementButtonTitle="Previous"
      decrementCallback={previousLapCallback}
      incrementButtonTitle="Next"
      incrementCallback={nextLapCallback}
    />
  );
};

export default ReplayLapStepper;
