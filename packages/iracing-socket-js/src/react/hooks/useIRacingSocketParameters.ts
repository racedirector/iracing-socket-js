import { invariant } from "../../utilities/globals";
import { iRacingSocketOptions } from "../../core";
import { useIRacingContext } from "../context";

export const useIRacingSocketParameters: () => iRacingSocketOptions = () => {
  const { socket } = useIRacingContext();

  invariant(
    !!socket,
    'Could not find "socket" in the context or pass in as an option. ' +
      "Wrap the root component in an <iRacingProvider>, or pass an iRacingSocket instance in via options.",
  );

  return {
    server: socket.server,
    requestParameters: socket.requestParameters,
    requestParametersOnce: socket.requestParametersOnce,
    fps: socket.fps,
    readIBT: socket.readIBT,
    reconnectTimeoutInterval: socket.reconnectTimeoutInterval,
  };
};

export default useIRacingSocketParameters;
