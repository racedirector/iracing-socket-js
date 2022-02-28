import { useIRacingContext } from "../context";

export interface UseIRacingSocketConnectionStateOptions {}

export const useIRacingSocketConnectionState: (
  options?: UseIRacingSocketConnectionStateOptions,
) => { isSocketConnected: boolean; isIRacingConnected: boolean } = () => {
  const { isSocketConnected, isIRacingConnected } = useIRacingContext();
  return {
    isSocketConnected,
    isIRacingConnected,
  };
};
