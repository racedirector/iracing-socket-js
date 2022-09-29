import React from "react";
import { useIRacingSocketConnectionState } from "@racedirector/iracing-socket-js";
import { ConnectionStatus as ConnectionStatusUI } from "../../components/ConnectionStatus";

export interface ConnectionStatusProps {}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = () => {
  const { isIRacingConnected, isSocketConnected } =
    useIRacingSocketConnectionState();

  return (
    <ConnectionStatusUI
      isIRacingConnected={isIRacingConnected}
      isSocketConnected={isSocketConnected}
    />
  );
};
