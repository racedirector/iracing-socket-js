import React, { useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { PitServiceFlags } from "@racedirector/iracing-socket-js";
import { capitalize } from "lodash";

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
  onChangeToggle?: (enabled: boolean) => void;
}

const ChangeTireInputField: React.FC<ChangeTireInputFieldProps> = ({
  change,
  onChangeToggle = () => {},
}) => {
  return (
    <Flex>
      <Text>Change</Text>
      <Checkbox
        isChecked={change}
        onChange={(event) => onChangeToggle(event.target.checked)}
      />
    </Flex>
  );
};

interface TirePressureInputFieldProps {
  pressure: number;
  onPressureChange?: (pressure: number) => void;
}

const TirePressureInputField: React.FC<TirePressureInputFieldProps> = ({
  pressure,
  onPressureChange = () => {},
}) => {
  return (
    <NumberInput
      min={0}
      value={pressure}
      onChange={(valueString) => onPressureChange(parseFloat(valueString))}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
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

  onPressureChange: (tire: TireType, pressure: number) => void;
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

  onPressureChange = () => {},
}) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      <GridItem>
        <Text>{capitalize(stringForTireType("lf"))}</Text>
        <TirePressureInputField
          pressure={leftFrontPressure}
          onPressureChange={(pressure) => onPressureChange("lf", pressure)}
        />
        <ChangeTireInputField tire="lf" change={changeLeftFront} />
      </GridItem>

      <GridItem>
        <Text>{capitalize(stringForTireType("rf"))}</Text>
        <TirePressureInputField
          pressure={rightFrontPressure}
          onPressureChange={(pressure) => onPressureChange("rf", pressure)}
        />
        <ChangeTireInputField tire="rf" change={changeRightFront} />
      </GridItem>

      <GridItem>
        <Text>{capitalize(stringForTireType("lr"))}</Text>
        <TirePressureInputField
          pressure={leftRearPressure}
          onPressureChange={(pressure) => onPressureChange("lr", pressure)}
        />
        <ChangeTireInputField tire="lr" change={changeLeftRear} />
      </GridItem>

      <GridItem>
        <Text>{capitalize(stringForTireType("rr"))}</Text>
        <TirePressureInputField
          pressure={rightRearPressure}
          onPressureChange={(pressure) => onPressureChange("rr", pressure)}
        />
        <ChangeTireInputField tire="rr" change={changeRightRear} />
      </GridItem>
    </Grid>
  );
};

interface FuelServiceProps {
  shouldFuel: boolean;
  fuelAmount: number;
  onFuelAmountChange?: (amount: number) => void;
}

const FuelService: React.FC<FuelServiceProps> = ({
  fuelAmount,
  shouldFuel,
  onFuelAmountChange = () => {},
}) => {
  return (
    <Flex>
      <Text>Fuel service:</Text>
      <Checkbox isChecked={shouldFuel} />
      <NumberInput
        min={0}
        value={fuelAmount}
        onChange={(valueString) => {
          onFuelAmountChange(parseFloat(valueString));
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
};

interface OtherServiceProps {
  tearoffEnabled: boolean;
  onTearoffToggle?: (enabled: boolean) => void;
  fastRepairEnabled: boolean;
  onFastRepairToggle?: (enabled: boolean) => void;
}

const OtherService: React.FC<OtherServiceProps> = ({
  tearoffEnabled,
  onTearoffToggle = () => {},
  fastRepairEnabled,
  onFastRepairToggle = () => {},
}) => (
  <Flex>
    <Flex>
      <Text>Tearoff</Text>
      <Checkbox
        isChecked={tearoffEnabled}
        onChange={(event) => onTearoffToggle(event.target.checked)}
      />
    </Flex>
    <Flex>
      <Text>Fast repair</Text>
      <Checkbox
        isChecked={fastRepairEnabled}
        onChange={(event) => onFastRepairToggle(event.target.checked)}
      />
    </Flex>
  </Flex>
);

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
  onFastRepairToggle?: OtherServiceProps["onFastRepairToggle"];
  onTearoffToggle?: OtherServiceProps["onTearoffToggle"];
  onClearAllService?: () => void;
  onClearTires?: () => void;
}

export const PitService: React.FC<PitServiceProps> = ({
  serviceFlags,
  leftFrontPressure,
  leftRearPressure,
  rightFrontPressure,
  rightRearPressure,
  fuelAmount,

  onPressureChange,
  onFuelAmountChange,
  onFastRepairToggle = () => {},
  onTearoffToggle = () => {},
  onClearAllService = () => {},
  onClearTires = () => {},
}) => {
  return (
    <Box>
      <OtherService
        tearoffEnabled={!!(serviceFlags & PitServiceFlags.WindshieldTearoff)}
        fastRepairEnabled={!!(serviceFlags & PitServiceFlags.FastRepair)}
        onFastRepairToggle={onFastRepairToggle}
        onTearoffToggle={onTearoffToggle}
      />
      <FuelService
        shouldFuel={!!(serviceFlags & PitServiceFlags.Fuel)}
        fuelAmount={fuelAmount}
        onFuelAmountChange={onFuelAmountChange}
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
        onPressureChange={onPressureChange}
      />
      <Flex>
        <Button onClick={onClearAllService}>Clear All Service</Button>
        <Button onClick={onClearTires}>Clear Tires</Button>
      </Flex>
    </Box>
  );
};

export default PitService;
