import React, { useMemo } from "react";
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  NumberInput,
  Text,
} from "@chakra-ui/react";
import { PitServiceFlags } from "@racedirector/iracing-socket-js";

type TireType = "lf" | "lr" | "rf" | "rr";

const stringForTireType = (type: TireType): string => {
  switch (type) {
    case "lf":
      return "left front";
    case "lr":
      return "left rear";
    case "rf":
      return "right front";
    case "rr":
      return "right rear";
  }
};

interface ChangeTireInputFieldProps {
  tire: TireType;
  change: boolean;
}

const ChangeTireInputField: React.FC<ChangeTireInputFieldProps> = ({
  change,
}) => {
  return (
    <Flex>
      <Text>Change</Text>
      <Checkbox checked={change} />
    </Flex>
  );
};

interface TirePressureInputFieldProps {
  tire: TireType;
  pressure: number;
}

const TirePressureInputField: React.FC<TirePressureInputFieldProps> = ({
  tire,
  pressure,
}) => {
  return (
    <Flex>
      <Text>{`${stringForTireType(tire)} pressure:`}</Text>
      <NumberInput value={pressure} />
    </Flex>
  );
};

interface TireServiceProps {
  leftFrontPressure: number;
  changeLeftFront: boolean;
  leftRearPressure: number;
  changeLeftRear: boolean;
  rightFrontPressure: number;
  changeRightFront: boolean;
  rightRearPressure: number;
  changeRightRear: boolean;
}

const TireService: React.FC<TireServiceProps> = ({
  leftFrontPressure,
  changeLeftFront,

  leftRearPressure,
  changeLeftRear,

  rightFrontPressure,
  changeRightFront,

  rightRearPressure,
  changeRightRear,
}) => {
  return (
    <Box>
      <TirePressureInputField tire="lf" pressure={leftFrontPressure} />
      <ChangeTireInputField tire="lf" change={changeLeftFront} />

      <TirePressureInputField tire="lr" pressure={leftRearPressure} />
      <ChangeTireInputField tire="lr" change={changeLeftRear} />

      <TirePressureInputField tire="rf" pressure={rightFrontPressure} />
      <ChangeTireInputField tire="rf" change={changeRightFront} />

      <TirePressureInputField tire="rr" pressure={rightRearPressure} />
      <ChangeTireInputField tire="rr" change={changeRightRear} />
    </Box>
  );
};

interface FuelServiceProps {
  shouldFuel: boolean;
  fuelAmount: number;
}

const FuelService: React.FC<FuelServiceProps> = ({
  fuelAmount,
  shouldFuel,
}) => {
  return (
    <Box>
      <Text>Fuel service:</Text>
      <NumberInput value={fuelAmount} />
      <Checkbox checked={shouldFuel} />
    </Box>
  );
};

export interface PitServiceProps
  extends Omit<
      TireServiceProps,
      | "changeLeftFront"
      | "changeLeftRear"
      | "changeRightFront"
      | "changeRightRear"
    >,
    Omit<FuelServiceProps, "shouldFuel"> {
  serviceFlags: PitServiceFlags;
}

export const PitService: React.FC<PitServiceProps> = ({
  serviceFlags,
  leftFrontPressure,
  leftRearPressure,
  rightFrontPressure,
  rightRearPressure,
  fuelAmount,
}) => {
  const shouldTearoff = useMemo(
    () => !!(serviceFlags & PitServiceFlags.WindshieldTearoff),
    [serviceFlags],
  );

  const shouldFastRepair = useMemo(
    () => !!(serviceFlags & PitServiceFlags.FastRepair),
    [serviceFlags],
  );

  return (
    <Box>
      {shouldFastRepair && <Heading size="xs">Fast Repair Enabled</Heading>}
      {shouldTearoff && <Text>Tearoff Enabled</Text>}

      <FuelService
        shouldFuel={!!(serviceFlags & PitServiceFlags.Fuel)}
        fuelAmount={fuelAmount}
      />
      <TireService
        leftFrontPressure={leftFrontPressure}
        changeLeftFront={!!(serviceFlags & PitServiceFlags.LFChange)}
        leftRearPressure={leftRearPressure}
        changeLeftRear={!!(serviceFlags & PitServiceFlags.LRChange)}
        rightFrontPressure={rightFrontPressure}
        changeRightFront={!!(serviceFlags & PitServiceFlags.RFChange)}
        rightRearPressure={rightRearPressure}
        changeRightRear={!!(serviceFlags & PitServiceFlags.RRChange)}
      />
    </Box>
  );
};

export default PitService;
