import React from 'react';
import {PitTimingConsumer} from 'iracing-socket-js';
import {SocketProvider} from '../SocketProvider';
import {PitTiming as PitTimingUI} from '../../components/PitTiming';

export interface PitTimingProps {
  server: string;
}

export const PitTiming: React.FC<PitTimingProps> = ({server, children}) => {
  return (
    <SocketProvider
      server={server}
      requestParameters={PitTimingConsumer.requestParameters}
      requestParametersOnce={PitTimingConsumer.requestParametersOnce}>
      <PitTimingUI>{children}</PitTimingUI>
    </SocketProvider>
  );
};

export default PitTiming;
