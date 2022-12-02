import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { find } from "lodash";
import { replaySearchSessionTime } from "@racedirector/iracing-socket-js";
import { useAppDispatch } from "src/app/hooks";
import { selectAllRaceEvents } from "src/features/raceEventsSlice";
import { RaceEventsTable as RaceEventsTableUI } from "../../components/RaceEventsTable";

export interface RaceEventsTableProps {}

export const RaceEventsTable: React.FC<RaceEventsTableProps> = () => {
  const dispatch = useAppDispatch();
  const raceEvents = useSelector(selectAllRaceEvents);
  const onRaceEventSelectCallback = useCallback(
    (eventId: string) => {
      const selectedEvent = find(raceEvents, ({ id }) => id === eventId);
      dispatch(
        replaySearchSessionTime({
          sessionNumber: selectedEvent.sessionNumber,
          sessionTime: selectedEvent.sessionTime,
        }),
      );
    },
    [dispatch, raceEvents],
  );

  return (
    <RaceEventsTableUI
      events={raceEvents}
      onPressEvent={onRaceEventSelectCallback}
    />
  );
};

export default RaceEventsTable;
