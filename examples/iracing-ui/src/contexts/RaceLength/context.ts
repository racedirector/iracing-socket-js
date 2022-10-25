import { RaceTime } from "@racedirector/iracing-socket-js";
import { getContextKey, getContext } from "../../utils";

export interface RaceLengthContextType {
  raceLaps: number;
  lapsRemaining: number;
  lapsComplete: number;
  sessionLength: RaceTime;
  isRaceTimed: boolean;
  estimatedLaps: number;
}

const DEFAULT_CONTEXT: RaceLengthContextType = {
  raceLaps: -1,
  lapsComplete: 0,
  lapsRemaining: -1,
  sessionLength: "unlimited",
  isRaceTimed: false,
  estimatedLaps: -1,
};

const contextKey = getContextKey("__IRACING_RACE_LENGTH_CONTEXT__");

export function getRaceLengthContext(): React.Context<RaceLengthContextType> {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "RaceLengthContext";
  return context;
}

export { getRaceLengthContext as resetRaceLengthContext };
