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
  carIndex: string;
  sessionTime: number;
  simTime: number;
  sessionNumber: number;
  driverName: string;
  driverId: number;
  weight: number;
}

export const IncidentRow: React.FC<IncidentRowProps> = ({
  sessionTime,
  simTime,
  driverName,
  weight,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sessionTimeLabel}>{sessionTime}</Text>
      <Text style={styles.sessionTimeLabel}>{simTime}</Text>
      <Text style={styles.driverNameLabel}>{driverName}</Text>
      <Text style={styles.incidentWeightLabel}>{weight}</Text>
    </View>
  );
};

export default IncidentRow;
