import React from "react";
import { invariant } from "ts-invariant";
import { FuelContextType, getFuelContext } from "./context";

export interface FuelConsumerProps {
  children: (context: FuelContextType) => React.ReactNode | undefined;
}

export const FuelConsumer: React.FC<FuelConsumerProps> = ({ children }) => {
  const FuelContext = getFuelContext();
  return (
    <FuelContext.Consumer>
      {(context: any) => {
        invariant(
          context,
          "Could not find fuel context. " +
            "Wrap the root component in a <FuelProvider>",
        );

        return children(context);
      }}
    </FuelContext.Consumer>
  );
};

export default FuelConsumer;
