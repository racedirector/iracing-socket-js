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

interface RequestedService {
  serviceFlags: PitServiceFlags;
  fuelAmount: number;
}

export interface PitTimingProps {}

export const PitTiming: React.FC<PitTimingProps> = ({children}) => {
  const {host} = useIRacingServerContext();
  invariant(!!host, 'host must be set');

  const [pitEntryDate, setPitEntryDate] = useState<Date>(null);
  const [pitExitDate, setPitExitDate] = useState<Date>(null);
  const [pitBoxEntryDate, setPitBoxEntryDate] = useState<Date>(null);
  const [pitBoxExitDate, setPitBoxExitDate] = useState<Date>(null);
  const [pitServiceStartDate, setPitServiceStartDate] = useState<Date>(null);
  const [pitServiceEndDate, setPitServiceEndDate] = useState<Date>(null);
  const [serviceStatus, setServiceStatus] = useState<PitServiceStatus>(null);
  const [{serviceFlags, fuelAmount}, setRequestedService] =
    useState<RequestedService>({
      serviceFlags: 0x0,
      fuelAmount: 0,
    });

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
      .on(PitTimingEvents.PitEntry, setPitEntryDate)
      .on(PitTimingEvents.PitExit, setPitExitDate)
      .on(PitTimingEvents.PitBoxEntry, setPitBoxEntryDate)
      .on(PitTimingEvents.PitBoxExit, setPitBoxExitDate)
      .on(PitTimingEvents.PitServiceStart, setPitServiceStartDate)
      .on(PitTimingEvents.PitServiceEnd, setPitServiceEndDate)
      .on(PitTimingEvents.PitServiceStatus, setServiceStatus)
      .on(PitTimingEvents.PitServiceRequest, newServiceFlags =>
        setRequestedService(previous => ({
          ...previous,
          serviceFlags: newServiceFlags,
        })),
      )
      .on(PitTimingEvents.PitServiceFuelLevelRequest, newFuelAmount =>
        setRequestedService(previous => ({
          ...previous,
          fuelAmount: newFuelAmount,
        })),
      )
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
      pitExitDate={pitExitDate}
      pitBoxEntryDate={pitBoxEntryDate}
      pitBoxExitDate={pitBoxExitDate}
      serviceStartDate={pitServiceStartDate}
      serviceEndDate={pitServiceEndDate}
      serviceStatus={serviceStatus}>
      {children}
    </PitTimingUI>
  );
};

export default PitTiming;
