import React from "react";
import { Flex, Heading, Button } from "@chakra-ui/react";

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
    <Flex>
      <Heading>{title}</Heading>
      <Button onClick={decrementCallback}>{decrementButtonTitle}</Button>
      <Button onClick={incrementCallback}>{incrementButtonTitle}</Button>
    </Flex>
  );
};

export default Stepper;
