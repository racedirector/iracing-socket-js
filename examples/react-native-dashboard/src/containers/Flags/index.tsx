import React from 'react';
import {FlagsConsumer} from 'iracing-socket-js';
import {SocketProvider} from '../SocketProvider';
import {Flags as FlagsUI} from '../../components/Flags';

export interface FlagsProps {
  server: string;
}

export const Flags: React.FC<FlagsProps> = ({server, children}) => {
  return (
    <SocketProvider
      server={server}
      requestParameters={FlagsConsumer.requestParameters}
      requestParametersOnce={FlagsConsumer.requestParametersOnce}>
      <FlagsUI>{children}</FlagsUI>
    </SocketProvider>
  );
};

export default Flags;
