import React from "react";
import { Text } from "@chakra-ui/react";
import { useAppSelector } from "src/app/hooks";
import { selectLiveEstimatedAverageFuelStintsRemaining } from "src/features/fuelSlice";
import { PitService } from "../PitService";
import RaceLength from "../RaceLength";
import PaceComparison from "../PaceComparison";
import {
  selectCurrentDriverIndex,
  selectCurrentDriverIsSpectator,
  selectCurrentSessionClassLeaderForCurrentDriverClass,
} from "@racedirector/iracing-socket-js";

export interface RaceStrategyProps {}

export const RaceStrategy: React.FC<RaceStrategyProps> = () => {
  const averageUsageFuelStintsRemaining = useAppSelector(
    selectLiveEstimatedAverageFuelStintsRemaining,
  );

  const classLeader = useAppSelector(({ iRacing }) =>
    selectCurrentSessionClassLeaderForCurrentDriverClass(iRacing),
  );

  const playerCarIndex = useAppSelector((state) => {
    const isSpectator = selectCurrentDriverIsSpectator(state.iRacing);
    return isSpectator ? undefined : selectCurrentDriverIndex(state.iRacing);
  });

  return (
    <>
      <Text>{`Fuel stints remaining: ${averageUsageFuelStintsRemaining}`}</Text>
      <PaceComparison
        targetIndex={classLeader.CarIdx}
        compareIndexes={[playerCarIndex].filter(Boolean)}
      />
      <PitService />
    </>
  );
};
