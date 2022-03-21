import React, {useRef} from 'react';
import {
  iRacingSocket,
  iRacingProvider as IRacingProvider,
  iRacingSocketOptions,
} from 'iracing-socket-js';

export interface SocketProviderProps extends iRacingSocketOptions {}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  server,
  requestParameters,
  requestParametersOnce,
  children,
}) => {
  const socket = useRef(
    new iRacingSocket({
      server,
      requestParameters,
      requestParametersOnce,
    }),
  );

  return <IRacingProvider socket={socket.current}>{children}</IRacingProvider>;
};

export default SocketProvider;
