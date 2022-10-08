import { useMemo } from "react";
import { useIRacingContext } from "../context";
import { Session } from "../../types";

export type UseCurrentSessionHook = () => Session | undefined;

export const useCurrentSession: UseCurrentSessionHook = () => {
  const { data: { SessionNum: sessionNumber = -1 } = {} } = useIRacingContext();
  return useSession(sessionNumber);
};

export type UseSessionHook = (sessionNumber: number) => Session | undefined;

export const useSession: UseSessionHook = (sessionNumber) => {
  const { data: { SessionInfo: { Sessions: sessions = [] } = {} } = {} } =
    useIRacingContext();

  const session = useMemo(() => {
    if (sessionNumber >= 0) {
      return sessions?.[sessionNumber] || undefined;
    }

    return undefined;
  }, [sessionNumber, sessions]);

  return session;
};

export default useSession;
