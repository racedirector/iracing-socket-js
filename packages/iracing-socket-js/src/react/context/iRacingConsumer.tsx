import * as React from "react";
import { invariant } from "../../utilities/globals";
import { iRacingSocket } from "../../core";
import { iRacingContext } from "./iRacingContext";

export interface iRacingConsumerProps {
  children: (raceDirector: iRacingSocket) => React.ReactChild | null;
}

export const iRacingConsumer: React.FC<iRacingConsumerProps> = (props) => {
  return (
    <iRacingContext.Consumer>
      {(context: any) => {
        invariant(
          context && context.socket,
          'Could not find "socket" in the context of iRacingConsumer. ' +
            "Wrap the root component in a <iRacingProvider>",
        );
        return props.children(context.raceDirector);
      }}
    </iRacingContext.Consumer>
  );
};
