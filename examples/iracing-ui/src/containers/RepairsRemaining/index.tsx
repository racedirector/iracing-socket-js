import { useIRacingContext } from "@racedirector/iracing-socket-js";
import React from "react";
import { RepairsRemaining as RepairsRemainingUI } from "../../components/RepairsRemaining";

export interface RepairsRemainingProps {}

export const RepairsRemaining: React.FC<RepairsRemainingProps> = () => {
  const {
    data: {
      FastRepairAvailable: totalFastRepairs,
      FastRepairUsed: usedFastRepairs,
      PitRepairLeft: requiredRepairTime,
      PitOptRepairLeft: optionalRepairTime,
    } = {},
  } = useIRacingContext();

  return (
    <RepairsRemainingUI
      usedFastRepairs={usedFastRepairs}
      totalFastRepairs={totalFastRepairs}
      optionalRepairTime={optionalRepairTime}
      requiredRepairTime={requiredRepairTime}
    />
  );
};

export default RepairsRemaining;