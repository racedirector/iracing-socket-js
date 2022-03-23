import React, {useEffect, useRef, useState} from 'react';
import invariant from 'ts-invariant';
import {
  PitTimingConsumer,
  PitTimingEvents,
  iRacingSocket,
} from 'iracing-socket-js';
import {PitTiming as PitTimingUI} from '../../components/PitTiming';
import {useIRacingServerContext} from '../../context/iRacingServer/iRacingServerContext';

export interface PitTimingProps {}

export const PitTiming: React.FC<PitTimingProps> = ({children}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const socketRef = useRef(
    new iRacingSocket({
      server: host,
      requestParameters: PitTimingConsumer.requestParameters,
      requestParametersOnce: PitTimingConsumer.requestParametersOnce,
    }),
  );

  const PitTimingConsumerRef = useRef(new PitTimingConsumer(socketRef.current));

  useEffect(() => {
    const consumer = PitTimingConsumerRef.current;
    consumer
      .on(PitTimingEvents.PitEntry, (carIndex, timestamp) => {
        console.log(`${carIndex} entered the pits at ${timestamp}`);
      })
      .on(PitTimingEvents.PitExit, (carIndex, timestamp) => {
        console.log(`${carIndex} exited the pits at ${timestamp}`);
      });

    return () => {
      consumer.removeAllListeners();
    };
  }, [PitTimingConsumerRef]);

  return <PitTimingUI>{children}</PitTimingUI>;
};

export default PitTiming;
