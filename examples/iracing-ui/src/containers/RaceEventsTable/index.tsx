import React from "react";
import { useSelector } from "react-redux";
import { allRaceEvents } from "src/features/raceEventsSlice";
import {
  RaceEventsTable as RaceEventsTableUI,
  RaceEventsTableProps as RaceEventsTableUIProps,
} from "../../components/RaceEventsTable";

export interface RaceEventsTableProps {}

export const RaceEventsTable: React.FC<RaceEventsTableProps> = () => {
  const raceEvents = useSelector(allRaceEvents);
  return <RaceEventsTableUI events={raceEvents} />;
};

export default RaceEventsTable;
