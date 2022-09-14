import React from 'react';
import AppUI from '../../components/App';
import {IRacingProvider, iRacingSocket} from "@racedirector/iracing-socket-js"

const socket = new iRacingSocket({
  server: "localhost:5152",
  requestParameters: ["SessionInfo", "WeekendInfo"],
  autoconnect: true,
})

export const App: React.FC<{}> = () => {
  return (
  <IRacingProvider socket={socket}>
    <AppUI />
  </IRacingProvider>
);
}

export default App;
