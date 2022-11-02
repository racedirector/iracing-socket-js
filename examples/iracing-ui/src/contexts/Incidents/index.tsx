import {
  Driver,
  useDriversByCarIndex,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { isEqual } from "lodash";
import React, { PropsWithChildren, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  addIncident,
  selectSimIncidents,
} from "src/features/simIncidentsSlice";
import usePrevious from "src/hooks/usePrevious";
import { getSimIncidentsContext } from "./context";

export interface IncidentsProviderProps {}

export const IncidentsProvider: React.FC<
  PropsWithChildren<IncidentsProviderProps>
> = ({ children = null }) => {
  const IncidentsContext = getSimIncidentsContext();
  const state = useAppSelector(selectSimIncidents);
  const dispatch = useAppDispatch();

  const {
    data: {
      SessionTimeOfDay = -1,
      SessionTime = -1,
      SessionNum = -1,
      CarIdxLapDistPct = [],
      CarIdxSessionFlags = [],
    } = {},
  } = useIRacingContext();

  const activeDrivers = useDriversByCarIndex({
    includePaceCar: false,
    includeAI: true,
    includeSpectators: false,
  });

  const previousActiveDrivers = usePrevious(activeDrivers);

  useEffect(() => {
    if (!isEqual(activeDrivers, previousActiveDrivers)) {
      Object.entries(activeDrivers).forEach(([carIndex, driver]) => {
        const existingDriver: Driver =
          previousActiveDrivers?.[carIndex] || null;

        // !!!: Ensuring that the driver exists and matches the current user ID
        //      ensures that incidents are processed iff we already know what drivers
        //      are on track.
        if (existingDriver && existingDriver.UserID === driver.UserID) {
          const incidentCount =
            driver.CurDriverIncidentCount -
            existingDriver.CurDriverIncidentCount;

          if (incidentCount > 0) {
            dispatch(
              addIncident({
                carIndex: parseInt(carIndex),
                value: incidentCount,
                sessionFlags: CarIdxSessionFlags?.[carIndex] || 0x0,
                lapPercentage: CarIdxLapDistPct?.[carIndex] || -1,
                sessionNumber: SessionNum,
                sessionTime: SessionTime,
                sessionTimeOfDay: SessionTimeOfDay,
                driverId: driver.UserID,
              }),
            );
          }
        }
      });
    }
  }, [
    CarIdxLapDistPct,
    CarIdxSessionFlags,
    SessionNum,
    SessionTime,
    SessionTimeOfDay,
    activeDrivers,
    dispatch,
    previousActiveDrivers,
  ]);

  return (
    <IncidentsContext.Provider value={state}>
      {children}
    </IncidentsContext.Provider>
  );
};

export default IncidentsProvider;
