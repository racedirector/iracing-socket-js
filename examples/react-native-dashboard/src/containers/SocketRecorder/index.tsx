import React, {useRef} from 'react';
import invariant from 'ts-invariant';
import {iRacingSocket} from 'iracing-socket-js';
import {useIRacingServerContext} from '../../context/iRacingServer/iRacingServerContext';

export interface SocketRecorderProps {}

export const SocketRecorder: React.FC<SocketRecorderProps> = ({
  children = null,
}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const socketRef = useRef(
    new iRacingSocket({
      server: host,
      requestParameters: [],
      requestParametersOnce: [],
    }),
  );

  return <>{children}</>;
};

export default SocketRecorder;
