import {capitalize} from 'lodash';
import {IncidentType} from 'racedirector-js/lib/types';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  sessionTimeLabel: {
    flex: 1,
  },
  driverNameLabel: {flex: 1},
  incidentWeightLabel: {flex: 1},
  incidentReasonLabel: {flex: 1},
  incidentTypeLabel: {flex: 1},
});

export interface IncidentRowProps {
  type: IncidentType;
  carIdx: number;
  carNumber: string;
  sessionTime: number;
  simTime: number;
  sessionNumber: number;
  driverName: string;
  driverId: string;
  weight: number;
  reason: string;
}

export const IncidentRow: React.FC<IncidentRowProps> = ({
  sessionTime,
  simTime,
  driverName,
  weight,
  reason,
  type,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sessionTimeLabel}>{sessionTime}</Text>
      <Text style={styles.sessionTimeLabel}>{simTime}</Text>
      <Text style={styles.driverNameLabel}>{driverName}</Text>
      <Text style={styles.incidentTypeLabel}>{capitalize(type)}</Text>
      <Text style={styles.incidentWeightLabel}>{weight}</Text>
      <Text style={styles.incidentReasonLabel}>{reason}</Text>
    </View>
  );
};

export default IncidentRow;
