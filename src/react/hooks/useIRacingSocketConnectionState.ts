import { useContext } from "react";
import { getIRacingContext } from "../context";

export interface UseIRacingSocketConnectionStateOptions {}

export const useIRacingSocketConnectionState: (
  options?: UseIRacingSocketConnectionStateOptions,
) => { isSocketConnected: boolean; isIRacingConnected: boolean } = () => {
  const { isSocketConnected, isIRacingConnected } = useContext(
    getIRacingContext(),
  );
  return {
    isSocketConnected,
    isIRacingConnected,
  };
};
