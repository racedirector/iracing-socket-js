import React, { useMemo } from "react";
import { useAppSelector } from "src/app/hooks";
import { selectHighestValueIncidentCluster } from "src/features/simIncidentsSlice";
import {
  IncidentsTable as IncidentsTableUI,
  IncidentsTableProps as IncidentsTableUIProps,
} from "../../components/IncidentsTable";

export interface IncidentsTableProps {}

export const IncidentsTable: React.FC<IncidentsTableProps> = () => {
  const incidents = useAppSelector((state) =>
    selectHighestValueIncidentCluster(state, 10, 100),
  );

  const normalizedIncidents: IncidentsTableUIProps["incidents"] = useMemo(
    () =>
      incidents.map(
        ({
          driverId,
          carIndex,
          lapPercentage,
          sessionFlags,
          sessionTime,
          value,
        }) => ({
          driverId,
          carIndex,
          sessionTime,
          value,
          trackPercentage: lapPercentage,
          flags: sessionFlags,
        }),
      ),
    [incidents],
  );

  return <IncidentsTableUI incidents={normalizedIncidents} />;
};

export default IncidentsTable;
