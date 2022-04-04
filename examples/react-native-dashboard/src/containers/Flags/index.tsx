import React, {useEffect, useRef, useState} from 'react';
import invariant from 'ts-invariant';
import {iRacingSocket} from '@racedirector/iracing-socket-js';
import {FlagsConsumer, FlagsEvents} from '@racedirector/iracing-flags-emitter';
import {Flags as FlagsUI} from '../../components/Flags';
import {useIRacingServerContext} from '../../context/iRacingServer/iRacingServerContext';

export interface FlagsProps {}

export const Flags: React.FC<FlagsProps> = ({children}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const [currentFlags, setCurrentFlags] = useState(0x0);

  const socketRef = useRef(
    new iRacingSocket({
      server: host,
      requestParameters: FlagsConsumer.requestParameters,
      requestParametersOnce: FlagsConsumer.requestParametersOnce,
    }),
  );

  const flagsConsumerRef = useRef(new FlagsConsumer(socketRef.current));

  useEffect(() => {
    const consumer = flagsConsumerRef.current;
    consumer.on(FlagsEvents.FlagChange, (_previousFlags, nextFlags) => {
      setCurrentFlags(nextFlags);
    });

    return () => {
      consumer.removeAllListeners();
    };
  }, [flagsConsumerRef]);

  return <FlagsUI value={currentFlags}>{children}</FlagsUI>;
};

export default Flags;
