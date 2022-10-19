import React from "react";
import {
  Grid,
  GridItem,
  Heading,
  Text,
  Input as InputUI,
  InputProps as InputUIProps,
  InputGroup,
  InputRightAddon,
  VStack,
} from "@chakra-ui/react";

interface InputProps {
  title: string;
  fuelUnit: string;
  onChange: InputUIProps["onChange"];
}

const Input: React.FC<InputProps> = ({ title, fuelUnit, onChange }) => {
  return (
    <VStack>
      <Heading>{title}</Heading>
      <InputGroup width="auto">
        <InputUI placeholder="Usage" onChange={onChange} />
        <InputRightAddon children={fuelUnit} />
      </InputGroup>
    </VStack>
  );
};

interface DisplayProps {
  title: string;
  detail: string;
}

const Display: React.FC<DisplayProps> = ({ title, detail }) => {
  return (
    <VStack>
      <Heading>{title}</Heading>
      <Text>{detail}</Text>
    </VStack>
  );
};

interface FuelDisplayProps {
  usage: number;
  unit: string;
  toAdd: number;
  remaining: number;

  prefix?: string;
}

const FuelDisplay: React.FC<FuelDisplayProps> = ({
  usage,
  unit,
  toAdd,
  remaining,
  prefix = null,
}) => (
  <Grid templateColumns={"repeat(3, 1fr)"}>
    <GridItem colSpan={1}>
      <Display
        title={`${prefix ? `${prefix} usage` : "Usage"}`}
        detail={`${usage}${unit}`}
      />
    </GridItem>

    <GridItem colSpan={1}>
      <Display title="To add" detail={`${toAdd}${unit}`} />
    </GridItem>

    <GridItem colSpan={1}>
      <Display title="Laps remaining" detail={`${remaining}`} />
    </GridItem>
  </Grid>
);

interface FuelDisplayInputProps {
  unit: InputProps["fuelUnit"];
  toAdd: number;
  remaining: number;

  onChange: InputProps["onChange"];

  prefix?: string;
}

const FuelDisplayInput: React.FC<FuelDisplayInputProps> = ({
  unit,
  toAdd,
  remaining,
  onChange,
  prefix = null,
}) => (
  <Grid templateColumns={"repeat(3, 1fr)"}>
    <GridItem colSpan={1}>
      <Input
        title={`${prefix ? `${prefix} usage` : "Usage"}`}
        onChange={onChange}
        fuelUnit={unit}
      />
    </GridItem>

    <GridItem colSpan={1}>
      <Display title="To add" detail={`${toAdd}${unit}`} />
    </GridItem>

    <GridItem colSpan={1}>
      <Display title="Laps remaining" detail={`${remaining}`} />
    </GridItem>
  </Grid>
);

export interface FuelCalculatorProps {
  raceLapsRemaining: number;
  fuelLevel: string;
  fuelUnit: string;
  lastFuelUsage: FuelDisplayProps;
  averageFuelUsage: FuelDisplayProps;
  customFuelUsage: Omit<FuelDisplayProps, "usage">;

  onCustomUsageChange?: (usage: number) => void;
}

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({
  fuelLevel,
  fuelUnit,
  raceLapsRemaining,
  lastFuelUsage,
  averageFuelUsage,
  customFuelUsage,
  onCustomUsageChange = () => {},
}) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)">
      <GridItem colSpan={1}>
        <Display title="Fuel level" detail={`${fuelLevel}${fuelUnit}`} />
      </GridItem>
      <GridItem colSpan={1}>
        <Display
          title="Race laps remaining"
          detail={raceLapsRemaining.toString()}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <FuelDisplay prefix="Average" {...averageFuelUsage} />
      </GridItem>

      <GridItem colSpan={2}>
        <FuelDisplay prefix="Last" {...lastFuelUsage} />
      </GridItem>

      <GridItem colSpan={2}>
        <FuelDisplayInput
          prefix="Custom"
          {...customFuelUsage}
          onChange={(event) => {
            onCustomUsageChange(parseFloat(event.target.value));
          }}
        />
      </GridItem>
    </Grid>
  );
};

export default FuelCalculator;
