import React, { useCallback } from "react";
import {
  replaySearch,
  ReplaySearchCommand,
} from "@racedirector/iracing-socket-js";
import { useDispatch } from "react-redux";
import Stepper from "../../components/Stepper";

export interface ReplayIncidentStepperProps {}

export const ReplayIncidentStepper: React.FC<
  ReplayIncidentStepperProps
> = () => {
  const dispatch = useDispatch();

  const nextIncidentCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.NextIncident));
  }, [dispatch]);

  const previousIncidentCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.PreviousIncident));
  }, [dispatch]);

  return (
    <Stepper
      title="Incidents"
      decrementButtonTitle="Previous"
      decrementCallback={previousIncidentCallback}
      incrementButtonTitle="Next"
      incrementCallback={nextIncidentCallback}
    />
  );
};
