import { invariant } from "ts-invariant";
import { iRacingSocket, iRacingSocketOptions } from "../../core";
import { useIRacingContext } from "../context";

export const useIRacingSocket: (
  options?: iRacingSocketOptions,
) => iRacingSocket = (socketOptions = null) => {
  let { socket } = useIRacingContext();

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
