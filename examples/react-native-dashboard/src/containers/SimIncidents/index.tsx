import React from 'react';
import {SimIncidentConsumer, IRacingProvider} from 'iracing-socket-js';

export interface SimIncidentsProps {}

export const SimIncidents: React.FC<SimIncidentsProps> = ({children}) => {
  return <IRacingProvider>{children}</IRacingProvider>;
};

export default SimIncidents;
