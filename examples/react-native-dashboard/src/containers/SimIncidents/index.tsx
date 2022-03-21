import React from 'react';
import {SimIncidentConsumer} from 'iracing-socket-js';
import {SocketProvider} from '../SocketProvider';

export interface SimIncidentsProps {
  server: string;
}

export const SimIncidents: React.FC<SimIncidentsProps> = ({
  server,
  children,
}) => {
  return (
    <SocketProvider
      server={server}
      requestParameters={SimIncidentConsumer.requestParameters}
      requestParametersOnce={SimIncidentConsumer.requestParametersOnce}>
      {children}
    </SocketProvider>
  );
};

export default SimIncidents;
