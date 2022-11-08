import { chatCommandMacro } from "@racedirector/iracing-socket-js";
import React, { useCallback } from "react";
import { useAppDispatch } from "src/app/hooks";
import { ChatMacros as ChatMacrosUI } from "../../components/ChatMacros";

export interface ChatMacrosProps {}

export const ChatMacros: React.FC<ChatMacrosProps> = () => {
  const dispatch = useAppDispatch();
  const chatMacroCallback = useCallback(
    (macroNumber: number) => {
      dispatch(chatCommandMacro(macroNumber));
    },
    [dispatch],
  );

  return <ChatMacrosUI onMacroPress={chatMacroCallback} />;
};
