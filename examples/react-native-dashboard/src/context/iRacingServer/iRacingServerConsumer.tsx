import * as React from 'react';
import {
  iRacingServerContextType,
  iRacingServerContext,
} from './iRacingServerContext';

export interface iRacingServerConsumerProps {
  children: (context: iRacingServerContextType) => React.ReactChild | null;
}

export const iRacingServerConsumer: React.FC<iRacingServerConsumerProps> =
  props => (
    <iRacingServerContext.Consumer>
      {(context: any) => {
        return props.children(context);
      }}
    </iRacingServerContext.Consumer>
  );
