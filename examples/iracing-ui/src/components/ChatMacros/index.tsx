import React from "react";
import { Button } from "@chakra-ui/react";

export interface ChatMacrosProps {
  onMacroPress: (index: number) => void;
}

export const ChatMacros: React.FC<ChatMacrosProps> = ({ onMacroPress }) => (
  <>
    <h1>Chat Macros</h1>
    <div>
      <Button onClick={() => onMacroPress(0)}>0</Button>
      <Button onClick={() => onMacroPress(1)}>1</Button>
      <Button onClick={() => onMacroPress(2)}>2</Button>
      <Button onClick={() => onMacroPress(3)}>3</Button>
      <Button onClick={() => onMacroPress(4)}>4</Button>
      <Button onClick={() => onMacroPress(5)}>5</Button>
      <Button onClick={() => onMacroPress(6)}>6</Button>
      <Button onClick={() => onMacroPress(7)}>7</Button>
      <Button onClick={() => onMacroPress(8)}>8</Button>
      <Button onClick={() => onMacroPress(9)}>9</Button>
    </div>
  </>
);

export default ChatMacros;
