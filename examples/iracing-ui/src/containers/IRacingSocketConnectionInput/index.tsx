import React, { useEffect } from "react";
import { IRacingSocketConnectionInput as IRacingSocketConnectionInputUI } from "src/components/IRacingSocketConnectionInput";
import { useIRacingSocketConnectionContext } from "src/contexts/IRacingSocketConnection";
import { useIRacingSocket } from "../IRacing";

export interface IRacingSocketConnectionInputProps {}

export const IRacingSocketConnectionInput: React.FC<
  IRacingSocketConnectionInputProps
> = () => {
  const { setServer, server } = useIRacingSocketConnectionContext();
  const { connect } = useIRacingSocket();

  useEffect(() => {
    connect();
  }, [server, connect]);

  return (
    <IRacingSocketConnectionInputUI
      server={server}
      onSubmit={setServer}
      onRefresh={connect}
    />
  );
};

export default IRacingSocketConnectionInput;
