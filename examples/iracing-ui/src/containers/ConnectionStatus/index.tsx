import React from "react";
import { useIRacingConnectionState } from "src/app/hooks";
import { ConnectionStatus as ConnectionStatusUI } from "../../components/ConnectionStatus";

export interface ConnectionStatusProps {}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = () => {
  const { isIRacingConnected, isSocketConnected } = useIRacingConnectionState();

  return (
    <ConnectionStatusUI
      isIRacingConnected={isIRacingConnected}
      isSocketConnected={isSocketConnected}
    />
  );
};
