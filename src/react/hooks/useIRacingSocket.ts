import { useContext } from "react";
import { invariant } from "../../utilities/globals";
import { iRacingSocket } from "../../core";
import { getIRacingContext } from "../context";

export interface UseIRacingSocketOptions {
  override?: (socket?: iRacingSocket | null) => iRacingSocket;
}

export const useIRacingSocket: (
  options?: UseIRacingSocketOptions,
) => iRacingSocket = ({ override } = {}) => {
  const context = useContext(getIRacingContext());

  let { socket } = context;
  if (override) {
    socket = override(socket);
  }

  invariant(
    !!socket,
    'Could not find "socket" in the context or pass in as an option. ' +
      "Wrap the root component in an <iRacingProvider>, or pass an iRacingSocket instance in via options.",
  );

  return socket;
};
