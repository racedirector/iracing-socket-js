import React, { PropsWithChildren, useEffect } from "react";
import {
  connectAction,
  disconnectAction,
} from "@racedirector/iracing-socket-js";
import { useAppDispatch } from "src/app/hooks";

export interface IRacingProps {}

export const IRacing: React.FC<PropsWithChildren<IRacingProps>> = ({
  children = null,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Connect socket explicitly");
    dispatch(connectAction());

    return () => {
      console.log("Disconnect socket explicitly...");
      dispatch(disconnectAction());
    };
  }, [dispatch]);

  return <>{children}</>;
};
