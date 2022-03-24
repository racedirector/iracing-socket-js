import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Text} from 'react-native';
import {PitServiceFlags, PitServiceStatus} from '../../../../../lib';
import {capitalize, isEmpty} from 'lodash';

const secondsDifference = (start: Date, end: Date) =>
  moment(end).diff(moment(start), 'seconds');

const secondsDuration = (start: Date, end: Date) =>
  moment.duration(secondsDifference(start, end), 'seconds');

const stringForPitServiceStatus = (serviceStatus: PitServiceStatus): string => {
  switch (serviceStatus) {
    case PitServiceStatus.InProgress:
      return 'In progress';
    case PitServiceStatus.Complete:
      return 'Complete';
    case PitServiceStatus.TooFarLeft:
      return 'Too far left';
    case PitServiceStatus.TooFarRight:
      return 'Too far right';
    case PitServiceStatus.TooFarForward:
      return 'Too far forward';
    case PitServiceStatus.TooFarBack:
      return 'Too far back';
    case PitServiceStatus.BadAngle:
      return 'Bad angle';
    case PitServiceStatus.CantFixThat:
      return "Can't fix that";
    default:
      return 'None';
  }
};

const stringForTireService = (serviceFlags: PitServiceFlags) => {
  const tireService = [
    (serviceFlags & PitServiceFlags.LFChange) === PitServiceFlags.LFChange
      ? 'LF'
      : null,
    (serviceFlags & PitServiceFlags.RFChange) === PitServiceFlags.RFChange
      ? 'RF'
      : null,
    (serviceFlags & PitServiceFlags.LRChange) === PitServiceFlags.LRChange
      ? 'LR'
      : null,
    (serviceFlags & PitServiceFlags.RRChange) === PitServiceFlags.RRChange
      ? 'RR'
      : null,
  ].filter(Boolean);

  if (isEmpty(tireService)) {
    return 'None';
  } else {
    return tireService.join(', ');
  }
};

const stringForNextService = (
  serviceFlags: PitServiceFlags,
  fuelAmount: number,
) => {
  const tireServiceString = stringForTireService(serviceFlags);
  const fuelServiceString =
    (serviceFlags & PitServiceFlags.Fuel) === PitServiceFlags.Fuel
      ? `${fuelAmount} fuel`
      : 'None';
  const tearoffServiceString =
    (serviceFlags & PitServiceFlags.WindshieldTearoff) ===
    PitServiceFlags.WindshieldTearoff
      ? 'Yes'
      : 'No';

  const fastRepairServiceString =
    (serviceFlags & PitServiceFlags.FastRepair) === PitServiceFlags.FastRepair
      ? 'Yes'
      : 'No';

  return [
    `Tires: ${tireServiceString}`,
    `Fuel: ${fuelServiceString}`,
    `Tearoff: ${tearoffServiceString}`,
    `Fast repair: ${fastRepairServiceString}`,
  ].join('\n');
};

export interface PitTimingProps {
  pitEntryDate?: Date;
  pitBoxEntryDate?: Date;
  pitBoxExitDate?: Date;
  pitExitDate?: Date;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
  serviceStatus?: PitServiceStatus;
  serviceFlags?: PitServiceFlags;
  fuelAmount?: number;
}

export const PitTiming: React.FC<PitTimingProps> = ({
  pitEntryDate,
  pitBoxEntryDate,
  pitBoxExitDate,
  pitExitDate,
  serviceStartDate,
  serviceEndDate,
  serviceFlags: serviceFlagsProp = 0x0,
  fuelAmount: fuelAmountProp = 0,
  serviceStatus = PitServiceStatus.None,
  children,
}) => {
  const [serviceFlags, setServiceFlags] =
    useState<PitServiceFlags>(serviceFlagsProp);
  const [fuelAmount, setFuelAmount] = useState(fuelAmountProp);
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
    setServiceFlags(serviceFlagsProp);
  }, [serviceFlagsProp]);

  useEffect(() => {
    setFuelAmount(fuelAmountProp);
  }, [fuelAmountProp]);

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

  console.log('Render');

  return (
    <>
      <Text>{`Next requested service status:\n${stringForNextService(
        serviceFlags,
        fuelAmount,
      )}`}</Text>
      <Text>{`Pit service status: ${stringForPitServiceStatus(
        serviceStatus,
      )}`}</Text>

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
