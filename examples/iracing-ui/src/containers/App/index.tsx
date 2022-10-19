import React from "react";
import AppUI from "../../components/App";
import { ChakraProvider } from "@chakra-ui/react";
import { IRacingSocketConnectionProvider } from "../../contexts/IRacingSocketConnection";
import { IRacing } from "../IRacing";

export const App: React.FC<Record<string, never>> = () => {
  return (
    <ChakraProvider>
      <IRacingSocketConnectionProvider>
        <IRacing>
          <AppUI />
        </IRacing>
      </IRacingSocketConnectionProvider>
    </ChakraProvider>
  );
};

export default App;
