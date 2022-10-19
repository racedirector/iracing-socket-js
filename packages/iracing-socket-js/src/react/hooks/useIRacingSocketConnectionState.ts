import { useIRacingContext } from "../context";

export interface UseIRacingSocketConnectionStateHookOptions {}

export interface UseIRacingSocketConnectionStateHookResult {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  connecting: boolean;
  connectionError?: Event;
}

export type UseIRacingSocketConnectionHook = (
  options?: UseIRacingSocketConnectionStateHookOptions,
) => UseIRacingSocketConnectionStateHookResult;

export const useIRacingSocketConnectionState: UseIRacingSocketConnectionHook =
  () => {
    const {
      isSocketConnected,
      isIRacingConnected,
      connecting,
      connectionError,
    } = useIRacingContext();

    return {
      connecting,
      isSocketConnected,
      isIRacingConnected,
      connectionError,
    };
  };
