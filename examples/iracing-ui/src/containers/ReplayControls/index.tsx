import { Box } from "@chakra-ui/react";
import {
  replaySearch,
  ReplaySearchCommand,
} from "@racedirector/iracing-socket-js";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import Stepper from "src/components/Stepper";
import ReplayFrameStepper from "../ReplayFrameStepper";
import { ReplayIncidentStepper } from "../ReplayIncidentStepper";
import ReplayLapStepper from "../ReplayLapStepper";
import ReplaySessionStepper from "../ReplaySessionStepper";
import { Cameras } from "../../containers/Cameras";

export interface ReplayControlsProps {}

export const ReplayControls: React.FC<ReplayControlsProps> = () => {
  const dispatch = useDispatch();
  const replayStartCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.ToStart));
  }, [dispatch]);

  const replayEndCallback = useCallback(() => {
    dispatch(replaySearch(ReplaySearchCommand.ToEnd));
  }, [dispatch]);

  return (
    <Box>
      <Cameras />
      <Stepper
        title="Replay"
        incrementButtonTitle="End"
        incrementCallback={replayEndCallback}
        decrementButtonTitle="Start"
        decrementCallback={replayStartCallback}
      />
      <ReplaySessionStepper />
      <ReplayLapStepper />
      <ReplayIncidentStepper />
      <ReplayFrameStepper />
    </Box>
  );
};
