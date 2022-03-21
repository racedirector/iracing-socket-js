import React from 'react';
import {DriverSwapConsumer} from 'iracing-socket-js';
import {SocketProvider} from '../SocketProvider';

export interface DriverSwapProps {
  server: string;
}

export const DriverSwap: React.FC<DriverSwapProps> = ({server, children}) => {
  return (
    <SocketProvider
      server={server}
      requestParameters={DriverSwapConsumer.requestParameters}
      requestParametersOnce={DriverSwapConsumer.requestParametersOnce}>
      {children}
    </SocketProvider>
  );
};

export default DriverSwap;
