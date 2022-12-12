import React from "react";
import { Text } from "@chakra-ui/react";
import { useAppSelector } from "src/app/hooks";
import { PitService } from "../PitService";
import PaceComparison from "../PaceComparison";
import { selectCurrentSessionClassLeaderForCurrentDriverClass } from "@racedirector/iracing-socket-js";
import PitStopTiming from "../PitStopTiming";
import RaceEventsTable from "../RaceEventsTable";

export interface RaceStrategyProps {}

export const RaceStrategy: React.FC<RaceStrategyProps> = () => {
  // const averageUsageFuelStintsRemaining = useAppSelector(
  //   selectLiveEstimatedAverageFuelStintsRemaining,
  // );

  const classLeader = useAppSelector(({ iRacing }) =>
    selectCurrentSessionClassLeaderForCurrentDriverClass(iRacing),
  );

  return (
    <>
      <RaceEventsTable />
      <Text>{`Fuel stints remaining: ${0}`}</Text>
      <PaceComparison targetIndex={classLeader?.CarIdx} />
      <PitService />
      <PitStopTiming />
    </>
  );
};
