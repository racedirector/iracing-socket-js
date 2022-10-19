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
import mockInitialState from "../../constants/mock";
import { iRacingData } from "../../types";

enum iRacingActionType {
  SOCKET_CONNECTING = "SOCKET_CONNECTING",
  SOCKET_CONNECT = "SOCKET_CONNECT",
  SOCKET_DISCONNECT = "SOCKET_DISCONNECT",
  SOCKET_CONNECT_ERROR = "SOCKET_CONNECT_ERROR",
  IRACING_CONNECT = "IRACING_CONNECT",
  IRACING_DISCONNECT = "IRACING_DISCONNECT",
  UPDATE = "UPDATE",
}

interface iRacingActionBase<T> {
  type: iRacingActionType;
  payload?: T;
}

interface SocketConnectingAction extends iRacingActionBase<boolean> {
  type: iRacingActionType.SOCKET_CONNECTING;
}

interface SocketConnectAction extends iRacingActionBase<undefined> {
  type: iRacingActionType.SOCKET_CONNECT;
}

interface SocketDisconnectAction extends iRacingActionBase<undefined> {
  type: iRacingActionType.SOCKET_DISCONNECT;
}

interface IRacingConnectAction extends iRacingActionBase<undefined> {
  type: iRacingActionType.IRACING_CONNECT;
}

interface IRacingDisconnectAction extends iRacingActionBase<undefined> {
  type: iRacingActionType.IRACING_DISCONNECT;
}

interface UpdateAction extends iRacingActionBase<iRacingData> {
  type: iRacingActionType.UPDATE;
}

interface ConnectionError extends iRacingActionBase<Event> {
  type: iRacingActionType.SOCKET_CONNECT_ERROR;
}

type iRacingAction =
  | SocketConnectingAction
  | SocketConnectAction
  | SocketDisconnectAction
  | IRacingConnectAction
  | IRacingDisconnectAction
  | UpdateAction
  | ConnectionError;

interface iRacingState extends Omit<iRacingContextType, "sendCommand"> {}

const initialState: iRacingState = {
  connecting: false,
  isSocketConnected: false,
  isIRacingConnected: false,
};

const reducer: Reducer<iRacingState, iRacingAction> = (
  state,
  { type, payload },
) => {
  switch (type) {
    case iRacingActionType.SOCKET_CONNECTING:
      return { ...state, connecting: payload, connectionError: undefined };
    case iRacingActionType.SOCKET_CONNECT:
      return { ...state, isSocketConnected: true };
    case iRacingActionType.SOCKET_DISCONNECT:
      return { ...state, isSocketConnected: false };
    case iRacingActionType.IRACING_CONNECT:
      return { ...state, isIRacingConnected: true };
    case iRacingActionType.IRACING_DISCONNECT:
      return { ...state, isIRacingConnected: false };
    case iRacingActionType.SOCKET_CONNECT_ERROR:
      return { ...state, connectionError: payload };
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
  useMock?: boolean;
  children?: React.ReactNode;
}

export const IRacingProvider: React.FC<iRacingProviderProps> = ({
  children,
  useMock = false,
  ...socketProps
}) => {
  const socketRef = useRef<iRacingSocket>(null);
  const [state, dispatch] = useReducer(
    reducer,
    useMock ? mockInitialState : initialState,
  );

  useEffect(() => {
    const socket = new iRacingSocket({
      ...socketProps,
      autoconnect: false,
    });
    socketRef.current = socket;

    socket.socketConnectionEmitter
      .on(iRacingSocketConnectionEvents.Connecting, (connecting) => {
        dispatch({
          type: iRacingActionType.SOCKET_CONNECTING,
          payload: connecting,
        });
      })
      .on(iRacingSocketConnectionEvents.Connect, () =>
        dispatch({ type: iRacingActionType.SOCKET_CONNECT }),
      )
      .on(iRacingSocketConnectionEvents.Disconnect, () =>
        dispatch({ type: iRacingActionType.SOCKET_DISCONNECT }),
      )
      .on(iRacingSocketConnectionEvents.Error, (error) => {
        dispatch({
          type: iRacingActionType.SOCKET_CONNECT_ERROR,
          payload: error,
        });
      });

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

    socket.open();

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
