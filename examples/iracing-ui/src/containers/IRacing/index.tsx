import React, { PropsWithChildren, useCallback, useEffect } from "react";
import { connect, disconnect } from "@racedirector/iracing-socket-js";
import { useAppDispatch } from "src/app/hooks";
import { useIRacingSocketConnectionContext } from "src/contexts/IRacingSocketConnection";
import { REQUEST_PARAMETERS } from "src/constants/socketRequestParameters";

export const useIRacingSocket = () => {
  const dispatch = useAppDispatch();
  const { server } = useIRacingSocketConnectionContext();

  const connectCallback = useCallback(() => {
    dispatch(
      connect({
        server,
        fps: 2,
        requestParameters: REQUEST_PARAMETERS,
      }),
    );
  }, [dispatch, server]);

  const disconnectCallback = useCallback(() => {
    dispatch(disconnect());
  }, [dispatch]);

  return {
    connect: connectCallback,
    disconnect: disconnectCallback,
  };
};

export interface IRacingProps {}

export const IRacing: React.FC<PropsWithChildren<IRacingProps>> = ({
  children = null,
}) => {
  const { connect, disconnect } = useIRacingSocket();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return <>{children}</>;
};
