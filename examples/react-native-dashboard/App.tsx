import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {IRacingProvider} from 'iracing-socket-js';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  // TODO: Change this URI to the machine running `iRacingBrowserAppser/server.exe` or `kapps.exe`
  const hostURI = '192.168.4.52:8182';
  return (
    <IRacingProvider server={hostURI}>
      <AppUI />
    </IRacingProvider>
  );
};

const AppUI = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return <SafeAreaView style={backgroundStyle} />;
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
