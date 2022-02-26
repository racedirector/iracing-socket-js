import { useContext } from "react";
import { getIRacingContext } from "../context";

export interface UseIRacingSocketConnectionStateOptions {}

export const useIRacingSocketConnectionState: (
  options: UseIRacingSocketConnectionStateOptions,
) => { socketConnected: boolean; iRacingConnected: boolean } = () => {
  const { socketConnected, iRacingConnected } = useContext(getIRacingContext());
  return {
    socketConnected,
    iRacingConnected,
  };
};
