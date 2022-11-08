import React from "react";
import { selectPitServiceRequest } from "@racedirector/iracing-socket-js";
import { useAppSelector } from "src/app/hooks";
import { PitService as PitServiceUI } from "../../components/PitService";

export interface PitServiceProps {}

export const PitService: React.FC<PitServiceProps> = () => {
  const {
    flags,
    fuelLevel,
    leftFrontPressure,
    leftRearPressure,
    rightFrontPressure,
    rightRearPressure,
  } = useAppSelector((state) => selectPitServiceRequest(state.iRacing));

  return (
    <PitServiceUI
      serviceFlags={flags}
      fuelAmount={fuelLevel}
      leftFrontPressure={leftFrontPressure}
      leftRearPressure={leftRearPressure}
      rightFrontPressure={rightFrontPressure}
      rightRearPressure={rightRearPressure}
    />
  );
};

export default PitService;
