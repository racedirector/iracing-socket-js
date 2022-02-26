import { useContext } from "react";
import { invariant } from "../../utilities/globals";
import { iRacingSocket } from "../../core";
import { getIRacingContext } from "../context";

export interface UseIRacingSocketOptions {
  override?: iRacingSocket;
}

export const useIRacingSocket: (
  options?: UseIRacingSocketOptions,
) => iRacingSocket = ({ override } = {}) => {
  const context = useContext(getIRacingContext());
  const socket = override || context.socket;
  invariant(
    !!socket,
    'Could not find "socket" in the context or pass in as an option. Wrap the root component in an <iRacingProvider>, or pass an iRacingSocket instance in via options.',
  );

  return socket;
};
