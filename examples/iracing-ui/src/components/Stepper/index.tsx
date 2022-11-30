import React from "react";
import { Flex, Heading, Button, ButtonGroup, Spacer } from "@chakra-ui/react";

export interface StepperProps {
  title: string;
  incrementButtonTitle?: string;
  decrementButtonTitle?: string;
  incrementCallback?: () => void;
  decrementCallback?: () => void;
}

export const Stepper: React.FC<StepperProps> = ({
  title,
  incrementButtonTitle = "Increment",
  incrementCallback = () => {},
  decrementButtonTitle = "Decrement",
  decrementCallback = () => {},
}) => {
  return (
    <Flex flex={1} paddingY={2}>
      <Heading size="md">{title}</Heading>
      <Spacer />
      <ButtonGroup gap={2}>
        <Button onClick={decrementCallback}>{decrementButtonTitle}</Button>
        <Button onClick={incrementCallback}>{incrementButtonTitle}</Button>
      </ButtonGroup>
    </Flex>
  );
};

export default Stepper;
