import { RaceTime } from "@racedirector/iracing-socket-js";
import { getContextKey, getContext } from "../../utils";

export interface RaceLengthContextType {
  // The number of race laps reported by the sim
  raceLaps: number | null;
  // The laps remaining based on `estimatedLaps` and `lapsComplete`
  lapsRemaining: Record<string, number>;
  // The number of laps completed indexed by class ID
  lapsComplete: Record<string, number>;
  // The length of the race reported by the sim
  sessionLength: RaceTime;
  isRaceTimed: boolean;
  // The total estimated laps indexed by class ID
  estimatedLaps: Record<string, number>;
}

const DEFAULT_CONTEXT: RaceLengthContextType = {
  sessionLength: "unlimited",
  isRaceTimed: false,
  raceLaps: 0,
  lapsComplete: {},
  lapsRemaining: {},
  estimatedLaps: {},
};

const contextKey = getContextKey("__IRACING_RACE_LENGTH_CONTEXT__");

export function getRaceLengthContext(): React.Context<RaceLengthContextType> {
  const context = getContext(contextKey, DEFAULT_CONTEXT);
  context.displayName = "RaceLengthContext";
  return context;
}

export { getRaceLengthContext as resetRaceLengthContext };
