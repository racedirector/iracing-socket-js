import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  label: {
    flex: 1,
  },
});

export interface IncidentRowProps {
  carIndex: string;
  sessionTime: number;
  simTime: number;
  sessionNumber: number;
  driverName: string;
  driverId: number;
  weight: number;
  lapPercentage: number;
}

export const IncidentRow: React.FC<IncidentRowProps> = ({
  sessionTime,
  simTime,
  driverName,
  weight,
  lapPercentage,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{sessionTime}</Text>
      <Text style={styles.label}>{`${lapPercentage * 100}%`}</Text>
      <Text style={styles.label}>{simTime}</Text>
      <Text style={styles.label}>{driverName}</Text>
      <Text style={styles.label}>{weight}</Text>
    </View>
  );
};

export default IncidentRow;
