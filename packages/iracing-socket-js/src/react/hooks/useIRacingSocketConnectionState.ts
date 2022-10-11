import { useIRacingContext } from "../context";

export interface UseIRacingSocketConnectionStateHookOptions {}

export interface UseIRacingSocketConnectionStateHookResult {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  connecting: boolean;
}

export type UseIRacingSocketConnectionHook = (
  options?: UseIRacingSocketConnectionStateHookOptions,
) => UseIRacingSocketConnectionStateHookResult;

export const useIRacingSocketConnectionState: UseIRacingSocketConnectionHook =
  () => {
    const { isSocketConnected, isIRacingConnected, connecting } =
      useIRacingContext();

    return {
      connecting,
      isSocketConnected,
      isIRacingConnected,
    };
  };
