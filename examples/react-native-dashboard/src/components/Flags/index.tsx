import React from 'react';
import {View, Text, ViewProps, StyleSheet} from 'react-native';
import {
  flagsHasFlag,
  Flags,
  flagsHasSomeFlags,
} from '@racedirector/iracing-socket-js';

const styles = StyleSheet.create({
  container: {
    borderColor: 'green',
  },
  title: {
    fontWeight: 'bold',
  },
  caution: {
    backgroundColor: 'yellow',
  },
});

export interface FlagIndicatorProps extends ViewProps {
  value: number;
}

const FlagIndicator: React.FC<FlagIndicatorProps> = ({value}) => {
  const underCaution = flagsHasSomeFlags(
    value,
    Flags.Caution,
    Flags.CautionWaving,
  );

  return (
    <View style={underCaution ? styles.caution : {}}>
      {flagsHasFlag(value, Flags.Checkered) ? (
        <Text>Checkered is out</Text>
      ) : null}
      {flagsHasFlag(value, Flags.White) ? <Text>White is out</Text> : null}
      {flagsHasFlag(value, Flags.Green) ? <Text>Green is out</Text> : null}
      {flagsHasFlag(value, Flags.Yellow) ? <Text>Yellow is out</Text> : null}
      {flagsHasFlag(value, Flags.CautionWaving) ? (
        <Text>Caution is waving</Text>
      ) : null}
      {flagsHasFlag(value, Flags.Caution) ? <Text>Caution is out</Text> : null}
      {flagsHasFlag(value, Flags.YellowWaving) ? (
        <Text>Yellow is waving</Text>
      ) : null}
      {flagsHasFlag(value, Flags.OneLapToGreen) ? (
        <Text>One to green</Text>
      ) : null}
      {flagsHasFlag(value, Flags.GreenHeld) ? <Text>Green held</Text> : null}
      {flagsHasFlag(value, Flags.TenToGo) ? <Text>Ten to go</Text> : null}
      {flagsHasFlag(value, Flags.StartHidden) ? (
        <Text>Start hidden</Text>
      ) : null}
      {flagsHasFlag(value, Flags.StartReady) ? <Text>Start ready</Text> : null}
      {flagsHasFlag(value, Flags.StartSet) ? <Text>Start set</Text> : null}
      {flagsHasFlag(value, Flags.StartGo) ? <Text>Start go</Text> : null}
    </View>
  );
};

export {FlagIndicator as Flags};

export default FlagIndicator;
