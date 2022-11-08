import React from "react";
import { Text } from "@chakra-ui/react";
import { useAppSelector } from "src/app/hooks";
import { selectLiveEstimatedAverageFuelStintsRemaining } from "src/features/fuelSlice";
import { PitService } from "../PitService";
import RaceLength from "../RaceLength";

export interface RaceStrategyProps {}

export const RaceStrategy: React.FC<RaceStrategyProps> = () => {
  const averageUsageFuelStintsRemaining = useAppSelector(
    selectLiveEstimatedAverageFuelStintsRemaining,
  );

  return (
    <>
      <RaceLength />
      <Text>{`Fuel stints remaining: ${averageUsageFuelStintsRemaining}`}</Text>
      <PitService />
    </>
  );
};
