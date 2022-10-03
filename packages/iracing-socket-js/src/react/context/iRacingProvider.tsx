import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useReducer,
  Reducer,
} from "react";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
  iRacingSocketOptions,
} from "../../core";
import { iRacingContext, iRacingContextType } from "./iRacingContext";
import { iRacingData } from "../../types";

enum iRacingActionType {
  SOCKET_CONNECT = "SOCKET_CONNECT",
  SOCKET_DISCONNECT = "SOCKET_DISCONNECT",
  IRACING_CONNECT = "IRACING_CONNECT",
  IRACING_DISCONNECT = "IRACING_DISCONNECT",
  UPDATE = "UPDATE",
}

interface iRacingAction {
  type: iRacingActionType;
  payload?: iRacingData;
}

interface iRacingState {
  isSocketConnected: boolean;
  isIRacingConnected: boolean;
  data?: iRacingData;
}

const initialState: iRacingState = {
  isSocketConnected: false,
  isIRacingConnected: false,
};

const reducer: Reducer<iRacingState, iRacingAction> = (
  state,
  { type, payload },
) => {
  switch (type) {
    case iRacingActionType.SOCKET_CONNECT:
      return { ...state, isSocketConnected: true };
    case iRacingActionType.SOCKET_DISCONNECT:
      return { ...state, isSocketConnected: false };
    case iRacingActionType.IRACING_CONNECT:
      return { ...state, isIRacingConnected: true };
    case iRacingActionType.IRACING_DISCONNECT:
      return { ...state, isIRacingConnected: false };
    case iRacingActionType.UPDATE:
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    default:
      throw new Error("Invalid action");
  }
};

export interface iRacingProviderProps extends iRacingSocketOptions {
  children?: React.ReactNode;
}

export const IRacingProvider: React.FC<iRacingProviderProps> = ({
  children,
  ...socketProps
}) => {
  const socketRef = useRef<iRacingSocket>(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const socket = new iRacingSocket(socketProps);
    socketRef.current = socket;

    socket.socketConnectionEmitter
      .on(iRacingSocketConnectionEvents.Connect, () =>
        dispatch({ type: iRacingActionType.SOCKET_CONNECT }),
      )
      .on(iRacingSocketConnectionEvents.Disconnect, () =>
        dispatch({ type: iRacingActionType.SOCKET_DISCONNECT }),
      );

    socket.iRacingConnectionEmitter
      .on(iRacingClientConnectionEvents.Connect, () =>
        dispatch({ type: iRacingActionType.IRACING_CONNECT }),
      )
      .on(iRacingClientConnectionEvents.Disconnect, () =>
        dispatch({ type: iRacingActionType.IRACING_DISCONNECT }),
      );

    socket.on(iRacingSocketEvents.Update, (keys: string[]) => {
      const newEntries = Object.entries(socket.data).filter(([key]) =>
        keys.includes(key),
      );

      dispatch({
        type: iRacingActionType.UPDATE,
        payload: Object.fromEntries(newEntries),
      });
    });

    return () => {
      socket.close();
      socket.removeAllListeners();
    };
  }, []);

  const sendCommandCallback = useCallback<iRacingSocket["sendCommand"]>(
    (...params) => {
      socketRef.current.sendCommand(...params);
    },
    [socketRef],
  );

  const socketState = useMemo<iRacingContextType>(
    () => ({
      ...state,
      sendCommand: sendCommandCallback,
    }),
    [state, sendCommandCallback],
  );

  return (
    <iRacingContext.Provider value={socketState}>
      {children}
    </iRacingContext.Provider>
  );
};

export default IRacingProvider;
