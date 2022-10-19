import React, { PropsWithChildren, useMemo } from "react";
import { IRacingProvider } from "@racedirector/iracing-socket-js";
import { useIRacingSocketConnectionContext } from "../../contexts/IRacingSocketConnection";

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
      {children}
    </IRacingProvider>
  );
};
