import React from "react";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import AppUI from "../../components/App";
import { IRacingSocketConnectionProvider } from "../../contexts/IRacingSocketConnection";
import { IRacing } from "../IRacing";
import { store } from "../../app/store";

export const App: React.FC<Record<string, never>> = () => {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <IRacingSocketConnectionProvider>
          <IRacing>
            <AppUI />
          </IRacing>
        </IRacingSocketConnectionProvider>
      </Provider>
    </ChakraProvider>
  );
};

export default App;
