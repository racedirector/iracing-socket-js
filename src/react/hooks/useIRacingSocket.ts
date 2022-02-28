import { useContext } from "react";
import { invariant } from "../../utilities/globals";
import { iRacingSocket, iRacingSocketOptions } from "../../core";
import { getIRacingContext } from "../context";

export const useIRacingSocket: (
  options?: iRacingSocketOptions,
) => iRacingSocket = (socketOptions = null) => {
  let { socket } = useContext(getIRacingContext());

  if (socketOptions) {
    socket = new iRacingSocket(socketOptions);
  }

  invariant(
    !!socket,
    'Could not find "socket" in the context or pass in as an option. ' +
      "Wrap the root component in an <iRacingProvider>, " +
      "or pass an iRacingSocket instance in via options.",
  );

  return socket;
};
