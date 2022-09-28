import React from "react";
import {
  Grid,
  GridItem,
  Button,
  ButtonProps,
  GridItemProps,
} from "@chakra-ui/react";

interface ChatMacroProps
  extends Pick<ButtonProps, "onClick">,
    Omit<GridItemProps, "onClick"> {}

const ChatMacro: React.FC<React.PropsWithChildren<ChatMacroProps>> = ({
  onClick,
  children,
  ...gridItemProps
}) => (
  <GridItem {...gridItemProps}>
    <Button onClick={onClick}>{children}</Button>
  </GridItem>
);

export interface ChatMacrosProps {
  onMacroPress: (index: number) => void;
}

export const ChatMacros: React.FC<ChatMacrosProps> = ({ onMacroPress }) => (
  <>
    <h1>Chat Macros</h1>
    <Grid templateColumns="repeat(3, 0fr)">
      <ChatMacro onClick={() => onMacroPress(1)}>1</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(2)}>2</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(3)}>3</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(4)}>4</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(5)}>5</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(6)}>6</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(7)}>7</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(8)}>8</ChatMacro>
      <ChatMacro onClick={() => onMacroPress(9)}>9</ChatMacro>
      <ChatMacro colStart={2} onClick={() => onMacroPress(0)}>
        0
      </ChatMacro>
    </Grid>
  </>
);

export default ChatMacros;
