import React, {useEffect, useRef, useState} from 'react';
import invariant from 'ts-invariant';
import {
  PitTimingConsumer,
  PitTimingEvents,
  iRacingSocket,
  PitServiceStatus,
  PitServiceFlags,
} from 'iracing-socket-js';
import {PitTiming as PitTimingUI} from '../../components/PitTiming';
import {useIRacingServerContext} from '../../context/iRacingServer/iRacingServerContext';
import {isEmpty} from 'lodash';

interface RequestedService {
  serviceFlags: PitServiceFlags;
  fuelAmount: number;
}

const useRequestedService = (): [
  RequestedService,
  (service: RequestedService) => void,
] => {
  const [requestedService, setRequestedService] = useState<RequestedService>({
    serviceFlags: 0x0,
    fuelAmount: 0,
  });

  const setRequestedServiceOverride = ({
    serviceFlags: requestedFlags,
    fuelAmount: requestedFuelAmount,
  }: RequestedService): void => {
    let update: Partial<RequestedService> = {};
    if (requestedFlags !== requestedService.serviceFlags) {
      update.serviceFlags = requestedFlags;
    }

    if (requestedFuelAmount !== requestedService.fuelAmount) {
      update.fuelAmount = requestedFuelAmount;
    }

    if (!isEmpty(update)) {
      setRequestedService(previous => ({...previous, update}));
    }
  };

  return [requestedService, setRequestedServiceOverride];
};

export interface PitTimingProps {}

export const PitTiming: React.FC<PitTimingProps> = ({children}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const [pitEntryDate, setPitEntryDate] = useState<Date>(null);
  const [serviceStatus, setServiceStatus] = useState<PitServiceStatus>(null);
  const [{serviceFlags, fuelAmount}, setRequestedService] =
    useRequestedService();

  const socketRef = useRef(
    new iRacingSocket({
      server: host,
      requestParameters: PitTimingConsumer.requestParameters,
      requestParametersOnce: PitTimingConsumer.requestParametersOnce,
    }),
  );

  const pitTimingConsumerRef = useRef(new PitTimingConsumer(socketRef.current));

  useEffect(() => {
    const consumer = pitTimingConsumerRef.current;
    consumer
      .on(PitTimingEvents.PitEntry, timestamp => {
        console.log(`${carIndex} entered the pits at ${timestamp}`);
        setPitEntryDate(timestamp);
      })
      .on(PitTimingEvents.PitExit, timestamp => {
        console.log(`${carIndex} exited the pits at ${timestamp}`);
      })
      .on(PitTimingEvents.PitBoxEntry, timestamp => {
        console.log(`${carIndex} entered their pit box at ${timestamp}`);
      })
      .on(PitTimingEvents.PitBoxExit, timestamp => {
        console.log(`${carIndex} exited their pit box at ${timestamp}`);
      })
      .on(PitTimingEvents.PitServiceStart, timestamp => {
        console.log(`${carIndex} started pit service at ${timestamp}`);
      })
      .on(PitTimingEvents.PitServiceEnd, timestamp => {
        console.log(`${carIndex} ended pit service at ${timestamp}`);
      })
      .on(PitTimingEvents.PitServiceStatus, error => {
        setServiceStatus(error);
      })
      .on(PitTimingEvents.PitServiceFuelLevelRequest, console.log)
      .on(PitTimingEvents.PitServiceTirePressureLevelRequest, console.log);

    return () => {
      consumer.removeAllListeners();
    };
  }, [pitTimingConsumerRef]);

  return (
    <PitTimingUI
      serviceFlags={serviceFlags}
      fuelAmount={fuelAmount}
      pitEntryDate={pitEntryDate}
      serviceStatus={serviceStatus}>
      {children}
    </PitTimingUI>
  );
};

export default PitTiming;
