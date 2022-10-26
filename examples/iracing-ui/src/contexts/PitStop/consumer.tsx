import React from "react";
import { invariant } from "ts-invariant";
import {
  PitStopAnalysisContextType,
  getPitStopAnalysisContext,
} from "./context";

export interface PitStopAnalysisConsumerProps {
  children: (
    context: PitStopAnalysisContextType,
  ) => React.ReactNode | undefined;
}

export const PitStopAnalysisConsumer: React.FC<
  PitStopAnalysisConsumerProps
> = ({ children }) => {
  const PitStopAnalysisContext = getPitStopAnalysisContext();
  return (
    <PitStopAnalysisContext.Consumer>
      {(context: any) => {
        invariant(
          context,
          "Could not find race length context. " +
            "Wrap the root component in a <PitStopAnalysisProvider>",
        );

        return children(context);
      }}
    </PitStopAnalysisContext.Consumer>
  );
};

export default PitStopAnalysisConsumer;
