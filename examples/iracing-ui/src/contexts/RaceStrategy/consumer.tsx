import React from "react";
import { invariant } from "ts-invariant";
import { RaceStrategyContextType, getRaceStrategyContext } from "./context";

export interface RaceStrategyConsumerProps {
  children: (context: RaceStrategyContextType) => React.ReactNode | undefined;
}

export const RaceStrategyConsumer: React.FC<RaceStrategyConsumerProps> = ({
  children,
}) => {
  const RaceStrategyContext = getRaceStrategyContext();
  return (
    <RaceStrategyContext.Consumer>
      {(context: any) => {
        invariant(
          context,
          "Could not find RaceStrategy context. " +
            "Wrap the root component in a <RaceStrategyProvider>",
        );

        return children(context);
      }}
    </RaceStrategyContext.Consumer>
  );
};

export default RaceStrategyConsumer;
