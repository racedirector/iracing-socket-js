import React from "react";

export interface ChatMacrosProps {
  onMacroPress: (index: number) => void;
}

export const ChatMacros: React.FC<ChatMacrosProps> = ({ onMacroPress }) => (
  <>
    <h1>Chat Macros</h1>
    <div>
      <button title="0" onClick={() => onMacroPress(0)} />
      <button title="1" onClick={() => onMacroPress(1)} />
      <button title="2" onClick={() => onMacroPress(2)} />
      <button title="3" onClick={() => onMacroPress(3)} />
      <button title="4" onClick={() => onMacroPress(4)} />
      <button title="5" onClick={() => onMacroPress(5)} />
      <button title="6" onClick={() => onMacroPress(6)} />
      <button title="7" onClick={() => onMacroPress(7)} />
      <button title="8" onClick={() => onMacroPress(8)} />
      <button title="9" onClick={() => onMacroPress(9)} />
    </div>
  </>
);

export default ChatMacros;
