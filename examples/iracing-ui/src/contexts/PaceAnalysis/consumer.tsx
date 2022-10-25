import React from "react";
import { invariant } from "ts-invariant";
import { PaceAnalysisContextType, getPaceAnalysisContext } from "./context";

export interface PaceAnalysisConsumerProps {
  children: (context: PaceAnalysisContextType) => React.ReactNode | undefined;
}

export const PaceAnalysisConsumer: React.FC<PaceAnalysisConsumerProps> = ({
  children,
}) => {
  const PaceAnalysisContext = getPaceAnalysisContext();
  return (
    <PaceAnalysisContext.Consumer>
      {(context: any) => {
        invariant(
          context,
          "Could not find race length context. " +
            "Wrap the root component in a <PaceAnalysisProvider>",
        );

        return children(context);
      }}
    </PaceAnalysisContext.Consumer>
  );
};

export default PaceAnalysisConsumer;
