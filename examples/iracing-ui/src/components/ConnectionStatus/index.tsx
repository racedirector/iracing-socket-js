import React from "react";

export interface ConnectionStatusProps {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isSocketConnected,
  isIRacingConnected,
}) => (
  <>
    <h1>iRacing Socket UI</h1>
    <p>Socket connected? {isSocketConnected ? "yes" : "no"}</p>
    <p>iRacing connected? {isIRacingConnected ? "yes" : "no"}</p>
  </>
);

export default ConnectionStatus;
