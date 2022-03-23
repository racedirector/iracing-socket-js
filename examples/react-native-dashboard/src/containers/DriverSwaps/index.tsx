import React, {useEffect, useRef, useState} from 'react';
import invariant from 'ts-invariant';
import {
  DriverSwapConsumer,
  DriverSwapEvents,
  iRacingSocket,
} from 'iracing-socket-js';
import {DriverSwaps as DriverSwapsUI} from '../../components/DriverSwaps';
import {useIRacingServerContext} from '../../context/iRacingServer/iRacingServerContext';

export interface DriverSwapsProps {}

export const DriverSwaps: React.FC<DriverSwapsProps> = ({children}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const [driverSwaps, setDriverSwaps] = useState([]);

  const socketRef = useRef(
    new iRacingSocket({
      server: host,
      requestParameters: DriverSwapConsumer.requestParameters,
      requestParametersOnce: DriverSwapConsumer.requestParametersOnce,
    }),
  );

  const driverSwapsConsumerRef = useRef(
    new DriverSwapConsumer(socketRef.current),
  );

  useEffect(() => {
    const consumer = driverSwapsConsumerRef.current;
    consumer.on(DriverSwapEvents.DriverSwaps, newDriverSwaps => {
      setDriverSwaps(previous => [
        ...previous,
        ...Object.values(newDriverSwaps),
      ]);
    });

    return () => {
      consumer.removeAllListeners();
    };
  }, [driverSwapsConsumerRef]);

  return <DriverSwapsUI data={driverSwaps}>{children}</DriverSwapsUI>;
};

export default DriverSwaps;
