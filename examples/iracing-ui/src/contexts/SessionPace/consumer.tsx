import React from "react";
import { invariant } from "ts-invariant";
import { PaceContextType, getPaceContext } from "./context";

export interface PaceConsumerProps {
  children: (context: PaceContextType) => React.ReactNode | undefined;
}

export const PaceConsumer: React.FC<PaceConsumerProps> = ({ children }) => {
  const PaceContext = getPaceContext();
  return (
    <PaceContext.Consumer>
      {(context: any) => {
        invariant(
          context,
          "Could not find pace context. " +
            "Wrap the root component in a <PaceProvider>",
        );

        return children(context);
      }}
    </PaceContext.Consumer>
  );
};

export default PaceConsumer;
