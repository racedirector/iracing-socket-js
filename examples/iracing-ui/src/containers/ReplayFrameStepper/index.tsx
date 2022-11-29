import React, { useCallback } from "react";
import {
  replaySearch,
  ReplaySearchCommand,
} from "@racedirector/iracing-socket-js";
import { useDispatch } from "react-redux";
import Stepper from "../../components/Stepper";

export interface ReplayFrameStepperProps {}

export const ReplayFrameStepper: React.FC<ReplayFrameStepperProps> = () => {
  const dispatch = useDispatch();

  const nextFrameCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.NextFrame));
  }, [dispatch]);

  const previousFrameCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.PreviousFrame));
  }, [dispatch]);

  return (
    <Stepper
      title="Frames"
      decrementButtonTitle="Previous"
      decrementCallback={previousFrameCallback}
      incrementButtonTitle="Next"
      incrementCallback={nextFrameCallback}
    />
  );
};

export default ReplayFrameStepper;
