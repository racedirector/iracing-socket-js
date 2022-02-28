import { useEffect, useState } from "react";
import { iRacingSocketEvents } from "../..";
import { iRacingData } from "../../types";
import { useIRacingContext } from "../context";

export const useIRacingSocketData: () => iRacingData = () => {
  let { socket } = useIRacingContext();
  const [data, setData] = useState({});

  useEffect(() => {
    function handleUpdate() {
      setData({ ...socket.data });
    }

    socket.on(iRacingSocketEvents.Update, handleUpdate);

    return () => {
      socket.removeListener(iRacingSocketEvents.Update, handleUpdate);
    };
  }, [socket]);

  return data;
};
