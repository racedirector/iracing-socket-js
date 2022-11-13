import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import AppUI from "../../components/App";
import { IRacingSocketConnectionProvider } from "../../contexts/IRacingSocketConnection";
import { IRacing } from "../IRacing";
import { store } from "../../app/store";

const AppProvider: React.FC<PropsWithChildren<Record<string, unknown>>> = ({
  children,
}) => {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <IRacingSocketConnectionProvider>
          <IRacing>{children}</IRacing>
        </IRacingSocketConnectionProvider>
      </Provider>
    </ChakraProvider>
  );
};

export const App: React.FC<Record<string, never>> = () => {
  return (
    <AppProvider>
      <AppUI />
    </AppProvider>
  );
};

export default App;
