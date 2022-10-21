import React, { PropsWithChildren, useMemo } from "react";
import { IRacingProvider } from "@racedirector/iracing-socket-js";
import { useIRacingSocketConnectionContext } from "../../contexts/IRacingSocketConnection";
import { PaceProvider } from "../../contexts/SessionPace";
import { FuelProvider } from "../../contexts/Fuel";
import { RaceLengthProvider } from "../../contexts/RaceLength";
import { StrengthOfFieldProvider } from "../../contexts/StrengthOfField";
import { RaceStrategyProvider } from "src/contexts/RaceStrategy";

const StrategyProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => (
  <PaceProvider>
    <RaceLengthProvider>
      <FuelProvider>
        <RaceStrategyProvider>{children}</RaceStrategyProvider>
      </FuelProvider>
    </RaceLengthProvider>
  </PaceProvider>
);

export interface IRacingProps {}

export const IRacing: React.FC<PropsWithChildren<IRacingProps>> = ({
  children,
}) => {
  const { host, port } = useIRacingSocketConnectionContext();

  const server = useMemo(() => {
    return `${host}:${port}`;
  }, [host, port]);

  return (
    <IRacingProvider
      server={server}
      fps={1}
      requestParameters={[
        "CameraInfo",
        "CarSetup",
        "DriverInfo",
        "QualifyResultsInfo",
        "RadioInfo",
        "SessionInfo",
        "SplitTimeInfo",
        "WeekendInfo",
        "__all_telemetry__",
      ]}
    >
      <StrengthOfFieldProvider>
        <StrategyProvider>{children}</StrategyProvider>
      </StrengthOfFieldProvider>
    </IRacingProvider>
  );
};
