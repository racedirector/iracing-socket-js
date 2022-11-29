import React, { useCallback } from "react";
import {
  replaySearch,
  ReplaySearchCommand,
} from "@racedirector/iracing-socket-js";
import { useDispatch } from "react-redux";
import Stepper from "src/components/Stepper";

export interface ReplaySessionStepperProps {}

export const ReplaySessionStepper: React.FC<ReplaySessionStepperProps> = () => {
  const dispatch = useDispatch();

  const nextSessionCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.ToNextSession));
  }, [dispatch]);

  const previousSessionCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.ToPreviousSession));
  }, [dispatch]);

  return (
    <Stepper
      title="Sessions"
      decrementButtonTitle="Previous"
      decrementCallback={previousSessionCallback}
      incrementButtonTitle="Next"
      incrementCallback={nextSessionCallback}
    />
  );
};

export default ReplaySessionStepper;
