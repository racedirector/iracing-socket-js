import React, {useEffect, useRef, useState} from 'react';
import invariant from 'ts-invariant';
import {
  SimIncidentConsumer,
  SimIncidentIndex,
  SimIncidentEvents,
  iRacingSocket,
} from 'iracing-socket-js';
import {
  Incidents as IncidentsUI,
  IncidentsProps,
} from '../../components/Incidents';
import {useIRacingServerContext} from '../../context/iRacingServer/iRacingServerContext';
import {IncidentRowProps} from 'components/IncidentRow';

export interface SimIncidentsProps {}

export const SimIncidents: React.FC<SimIncidentsProps> = ({children}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const [incidents, setIncidents] = useState<IncidentsProps['data']>([]);

  const socketRef = useRef(
    new iRacingSocket({
      server: host,
      requestParameters: SimIncidentConsumer.requestParameters,
      requestParametersOnce: SimIncidentConsumer.requestParametersOnce,
    }),
  );

  const incidentsConsumerRef = useRef(
    new SimIncidentConsumer({socket: socketRef.current}),
  );

  useEffect(() => {
    const consumer = incidentsConsumerRef.current;
    consumer.on(SimIncidentEvents.SimIncidents, (index: SimIncidentIndex) => {
      const driverIndex = consumer.driverIndex;
      const newIncidents: IncidentRowProps[] = Object.entries(index).map(
        ([carIndex, {sessionTimeOfDay, ...incident}]) => ({
          ...incident,
          simTime: sessionTimeOfDay,
          driverName: driverIndex[carIndex].UserName,
        }),
      );
      setIncidents(oldIncidents => [...oldIncidents, ...newIncidents]);
    });

    return () => {
      consumer.removeAllListeners();
    };
  }, [incidentsConsumerRef]);

  return <IncidentsUI data={incidents}>{children}</IncidentsUI>;
};

export default SimIncidents;
