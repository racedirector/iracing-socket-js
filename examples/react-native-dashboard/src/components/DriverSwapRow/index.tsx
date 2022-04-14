import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  label: {
    flex: 1,
  },
});

export interface DriverSwapRowProps {
  carIdx: number;
  carNumber: string;
  sessionTime: number;
  simTime: number;
  sessionNumber: number;
  fromDriver: string;
  toDriver: string;
}

export const DriverSwapRow: React.FC<DriverSwapRowProps> = ({
  carIdx,
  carNumber,
  sessionTime,
  simTime,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{carIdx}</Text>
      <Text style={styles.label}>{carNumber}</Text>
      <Text style={styles.label}>{sessionTime}</Text>
      <Text style={styles.label}>{sessionTime}</Text>
      <Text style={styles.label}>{simTime}</Text>
    </View>
  );
};

export default DriverSwapRow;
