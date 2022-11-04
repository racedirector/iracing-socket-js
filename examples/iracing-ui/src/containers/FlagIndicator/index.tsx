import React from "react";
import { useIRacingContext } from "src/app/hooks";
import { FlagIndicator as FlagIndicatorUI } from "src/components/FlagIndicator";

export interface FlagIndicatorProps {}

export const FlagIndicator: React.FC<FlagIndicatorProps> = () => {
  const { data: { SessionFlags = 0x0 } = {} } = useIRacingContext();

  return <FlagIndicatorUI value={SessionFlags} />;
};

export default FlagIndicator;
