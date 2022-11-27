import React, { useMemo, useCallback } from "react";
import { find } from "lodash";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { selectAllIncidents } from "src/features/simIncidentsSlice";
import {
  IncidentsTable as IncidentsTableUI,
  IncidentsTableProps as IncidentsTableUIProps,
} from "../../components/IncidentsTable";
import { replaySearchSessionTime } from "@racedirector/iracing-socket-js";

export interface IncidentsTableProps {}

export const IncidentsTable: React.FC<IncidentsTableProps> = () => {
  const dispatch = useAppDispatch();
  const incidents = useAppSelector(selectAllIncidents);

  const normalizedIncidents: IncidentsTableUIProps["incidents"] = useMemo(
    () =>
      incidents.map(
        ({
          id,
          driverId,
          carIndex,
          lapPercentage,
          sessionFlags,
          sessionTime,
          value,
        }) => ({
          id,
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

  const onIncidentSelectCallback = useCallback(
    (id: string) => {
      const selectedIncident = find(
        incidents,
        ({ id: incidentId }) => incidentId === id,
      );
      dispatch(
        replaySearchSessionTime({
          sessionNumber: selectedIncident.sessionNumber,
          sessionTime: selectedIncident.sessionTime,
        }),
      );
    },
    [dispatch, incidents],
  );

  return (
    <IncidentsTableUI
      incidents={normalizedIncidents}
      onPressIncident={onIncidentSelectCallback}
    />
  );
};

export default IncidentsTable;
