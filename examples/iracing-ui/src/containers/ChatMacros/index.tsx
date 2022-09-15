import {
  iRacingSocketCommands,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import React, { useCallback } from "react";
import { ChatMacros as ChatMacrosUI } from "../../components/ChatMacros";

export interface ChatMacrosProps {}

export const ChatMacros: React.FC<ChatMacrosProps> = () => {
  const { sendCommand } = useIRacingContext();
  const chatMacroCallback = useCallback(
    (macroNumber) => {
      sendCommand(iRacingSocketCommands.ChatCommandMacro, [macroNumber]);
    },
    [sendCommand],
  );

  return <ChatMacrosUI onMacroPress={chatMacroCallback} />;
};
