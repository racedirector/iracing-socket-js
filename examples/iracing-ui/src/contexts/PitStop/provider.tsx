import {
  PitServiceStatus,
  TrackLocation,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import React, { PropsWithChildren, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectPitStopAnalysis,
  updateServiceFlags,
  updateServiceStatus,
  updateTrackLocation,
} from "../../features/pitStopAnalysisSlice";
import { getPitStopAnalysisContext } from "./context";

export interface PitStopAnalysisProviderProps {}

export const PitStopAnalysisProvider: React.FC<
  PropsWithChildren<PitStopAnalysisProviderProps>
> = ({ children = null }) => {
  const PitStopAnalysisContext = getPitStopAnalysisContext();
  const state = useAppSelector(selectPitStopAnalysis);
  const dispatch = useAppDispatch();

  const {
    data: {
      SessionTime: sessionTime,
      PlayerCarPitSvStatus: serviceStatus = PitServiceStatus.None,
      PitSvFlags: requestedService = 0x0,
      PitSvFuel: requestedFuel = -1,
      Lap: currentLap,
      PlayerTrackSurface: playerTrackLocation = TrackLocation.NotInWorld,
    } = {},
  } = useIRacingContext();

  // If the service status flags differ from those tracked in state, update them,
  // as well as information on when the pit service started.
  useEffect(() => {
    if (serviceStatus && serviceStatus !== state.serviceState) {
      dispatch(
        updateServiceStatus({
          status: serviceStatus,
          sessionTime: sessionTime,
          lapNumber: currentLap,
        }),
      );
    }
  }, [currentLap, dispatch, serviceStatus, sessionTime, state.serviceState]);

  // If the requested service flags change, update state.
  useEffect(() => {
    if (
      requestedService &&
      requestedService !== state.nextServiceRequest.service
    ) {
      dispatch(
        updateServiceFlags({
          serviceFlags: requestedService,
          sessionTime,
          fuelLevel: requestedFuel,
        }),
      );
    }
  }, [
    requestedService,
    dispatch,
    sessionTime,
    state.nextServiceRequest.service,
    requestedFuel,
  ]);

  useEffect(() => {
    if (
      playerTrackLocation &&
      playerTrackLocation !== state.playerTrackLocation
    ) {
      dispatch(
        updateTrackLocation({
          trackLocation: playerTrackLocation,
          sessionTime,
          lapNumber: currentLap,
        }),
      );
    }
  }, [
    currentLap,
    dispatch,
    playerTrackLocation,
    sessionTime,
    state.playerTrackLocation,
  ]);

  return (
    <PitStopAnalysisContext.Provider value={state}>
      {children}
    </PitStopAnalysisContext.Provider>
  );
};

export default PitStopAnalysisProvider;
