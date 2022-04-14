import React from "react";
import RootNavigator from "./navigators";
import IRacingServerProvider from "./context/iRacingServer/iRacingServerProvider";

const AppUI: React.FC<{}> = ({ children = null }) => {
  return <RootNavigator>{children}</RootNavigator>;
};

export const App: React.FC<{}> = ({ children }) => {
  // TODO: Change this URI to the machine running `iRacingBrowserAppser/server.exe` or `kapps.exe`
  return (
    <IRacingServerProvider host="localhost:8182">
      <AppUI>{children}</AppUI>
    </IRacingServerProvider>
  );
};

export default App;
