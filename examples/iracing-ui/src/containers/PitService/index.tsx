import React from "react";
import {
  pitCommand,
  PitCommandMode,
  selectPitServiceRequest,
} from "@racedirector/iracing-socket-js";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { PitService as PitServiceUI } from "../../components/PitService";
import RepairsRemaining from "../RepairsRemaining";

export interface PitServiceProps {}

export const PitService: React.FC<PitServiceProps> = () => {
  const dispatch = useAppDispatch();
  const {
    flags,
    fuelLevel,
    leftFrontPressure,
    leftRearPressure,
    rightFrontPressure,
    rightRearPressure,
  } = useAppSelector(({ iRacing }) => selectPitServiceRequest(iRacing));

  return (
    <>
      <RepairsRemaining />
      <PitServiceUI
        serviceFlags={flags}
        fuelAmount={fuelLevel}
        leftFrontPressure={leftFrontPressure}
        leftRearPressure={leftRearPressure}
        rightFrontPressure={rightFrontPressure}
        rightRearPressure={rightRearPressure}
        onFastRepairToggle={() => {
          dispatch(pitCommand({ command: PitCommandMode.FR, fuel: fuelLevel }));
        }}
        onTearoffToggle={() =>
          dispatch(
            pitCommand({ command: PitCommandMode.Windshield, fuel: fuelLevel }),
          )
        }
        onFuelAmountChange={(amount) => {
          dispatch(
            pitCommand({
              command: PitCommandMode.Fuel,
              fuel: amount,
            }),
          );
        }}
        onPressureChange={(tire, pressure) => {
          let command: PitCommandMode;
          switch (tire) {
            case "lf":
              command = PitCommandMode.LF;
              break;
            case "lr":
              command = PitCommandMode.LR;
              break;
            case "rf":
              command = PitCommandMode.RF;
              break;
            case "rr":
              command = PitCommandMode.RR;
              break;
            default:
              throw new Error("Invalid tire type!");
          }

          dispatch(
            pitCommand({
              command: command,
              fuel: pressure,
            }),
          );
        }}
        onClearAllService={() => {
          dispatch(
            pitCommand({ command: PitCommandMode.Clear, fuel: fuelLevel }),
          );
        }}
        onClearTires={() => {
          dispatch(
            pitCommand({ command: PitCommandMode.ClearTires, fuel: fuelLevel }),
          );
        }}
      />
    </>
  );
};

export default PitService;
