import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import AppUI from "../../components/App";
import { IRacingSocketConnectionProvider } from "../../contexts/IRacingSocketConnection";
import { IRacing } from "../IRacing";
import { store } from "../../app/store";
import { Provider } from "react-redux";
import { StrengthOfFieldProvider } from "src/contexts/StrengthOfField";

export const App: React.FC<Record<string, never>> = () => {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <IRacingSocketConnectionProvider>
          <StrengthOfFieldProvider>
            <IRacing>
              <AppUI />
            </IRacing>
          </StrengthOfFieldProvider>
        </IRacingSocketConnectionProvider>
      </Provider>
    </ChakraProvider>
  );
};

export default App;
