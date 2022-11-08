import React from "react";
import { PitService } from "../PitService";
import RaceLength from "../RaceLength";
import RepairsRemaining from "../RepairsRemaining";

export interface RaceStrategyProps {}

export const RaceStrategy: React.FC<RaceStrategyProps> = () => {
  return (
    <>
      <RaceLength />
      <RepairsRemaining />
      <PitService />
    </>
  );
};
