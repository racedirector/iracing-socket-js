import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Text} from 'react-native';
const secondsDifference = (start: Date, end: Date) =>
  moment(end).diff(moment(start), 'seconds');

const secondsDuration = (start: Date, end: Date) =>
  moment.duration(secondsDifference(start, end), 'seconds');

export interface PitTimingProps {
  pitEntryDate?: Date;
  pitBoxEntryDate?: Date;
  pitBoxExitDate?: Date;
  pitExitDate?: Date;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
}

export const PitTiming: React.FC<PitTimingProps> = ({
  pitEntryDate,
  pitBoxEntryDate,
  pitBoxExitDate,
  pitExitDate,
  serviceStartDate,
  serviceEndDate,
  children,
}) => {
  const [stationaryDuration, setStationaryDuration] =
    useState<moment.Duration>(null);
  const [totalPitDuration, setTotalPitDuration] =
    useState<moment.Duration>(null);
  const [serviceDuration, setServiceDuration] = useState<moment.Duration>(null);
  const [entryToServiceEnd, setEntryToServiceEnd] =
    useState<moment.Duration>(null);
  const [entryToServiceStart, setEntryToServiceStart] =
    useState<moment.Duration>(null);

  useEffect(() => {
    if (pitEntryDate && pitExitDate) {
      setTotalPitDuration(secondsDuration(pitEntryDate, pitExitDate));
    }
  }, [pitEntryDate, pitExitDate]);

  useEffect(() => {
    if (pitBoxEntryDate && pitBoxExitDate) {
      setStationaryDuration(secondsDuration(pitBoxEntryDate, pitBoxExitDate));
    }
  }, [pitBoxEntryDate, pitBoxExitDate]);

  useEffect(() => {
    if (serviceStartDate && serviceEndDate) {
      setServiceDuration(secondsDuration(serviceStartDate, serviceEndDate));
    }
  }, [serviceStartDate, serviceEndDate]);

  useEffect(() => {
    if (pitEntryDate && serviceStartDate) {
      setEntryToServiceStart(secondsDuration(pitEntryDate, serviceStartDate));
    }
  }, [pitEntryDate, serviceStartDate]);

  useEffect(() => {
    if (pitEntryDate && serviceEndDate) {
      setEntryToServiceEnd(secondsDuration(pitEntryDate, serviceEndDate));
    }
  }, [pitEntryDate, serviceEndDate]);

  return (
    <>
      {pitEntryDate ? (
        <Text>{`Pit entry: ${pitEntryDate.toString()}`}</Text>
      ) : null}
      {pitBoxEntryDate ? (
        <Text>{`Pit box entry: ${pitBoxEntryDate.toString()}`}</Text>
      ) : null}

      {serviceStartDate ? (
        <Text>{`Pit service start: ${serviceStartDate.toString()}`}</Text>
      ) : null}
      {serviceEndDate ? (
        <Text>{`Pit service end: ${serviceEndDate.toString()}`}</Text>
      ) : null}

      {pitBoxExitDate ? (
        <Text>{`Pit box exit: ${pitBoxExitDate.toString()}`}</Text>
      ) : null}
      {pitExitDate ? (
        <Text>{`Pit exit: ${pitExitDate.toString()}`}</Text>
      ) : null}

      {stationaryDuration ? (
        <Text>{`Stationary duration: ${stationaryDuration.format(
          'hh:mm:ss.sss',
        )}`}</Text>
      ) : null}

      {serviceDuration ? (
        <Text>{`Service duration: ${serviceDuration.format(
          'hh:mm:ss.sss',
        )}`}</Text>
      ) : null}

      {entryToServiceStart ? (
        <Text>{`Entry -> Service start duration: ${entryToServiceStart.format(
          'hh:mm:ss.sss',
        )}`}</Text>
      ) : null}

      {entryToServiceEnd ? (
        <Text>{`Entry -> Service end duration: ${entryToServiceEnd.format(
          'hh:mm:ss.sss',
        )}`}</Text>
      ) : null}

      {totalPitDuration ? (
        <Text>{`Total pit duration: ${totalPitDuration.format(
          'hh:mm:ss.sss',
        )}`}</Text>
      ) : null}

      {children}
    </>
  );
};

export default PitTiming;
