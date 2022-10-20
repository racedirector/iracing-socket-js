import React from "react";
import { invariant } from "ts-invariant";
import { RaceLengthContextType, getRaceLengthContext } from "./context";

export interface RaceLengthConsumerProps {
  children: (context: RaceLengthContextType) => React.ReactNode | undefined;
}

export const RaceLengthConsumer: React.FC<RaceLengthConsumerProps> = ({
  children,
}) => {
  const RaceLengthContext = getRaceLengthContext();
  return (
    <RaceLengthContext.Consumer>
      {(context: any) => {
        invariant(
          context,
          "Could not find race length context. " +
            "Wrap the root component in a <RaceLengthProvider>",
        );

        return children(context);
      }}
    </RaceLengthContext.Consumer>
  );
};

export default RaceLengthConsumer;
