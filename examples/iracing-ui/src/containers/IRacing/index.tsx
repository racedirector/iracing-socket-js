import React, { PropsWithChildren, useCallback, useEffect } from "react";
import { connect, disconnect } from "@racedirector/iracing-socket-js";
import { useAppDispatch } from "src/app/hooks";
import { useIRacingSocketConnectionContext } from "src/contexts/IRacingSocketConnection";

const REQUEST_PARAMETERS = [
  "DriverInfo",
  "QualifyResultsInfo",
  "SessionInfo",
  "SplitTimeInfo",
  "WeekendInfo",
  "CarIdxSessionFlags",
  "CarIdxLapDistPct",
  "CarIdxBestLapTime",
  "CarIdxLastLapTime",
  "CarIdxLapCompleted",
  "SessionNum",
  "SessionTime",
  "SessionTick",
  "SessionTimeOfDay",
  "SessionTimeRemain",
  "SessionState",

  "Lap",
  "LapCompleted",

  // Replay/Cameras
  "CameraInfo",
  "CamCarIdx",
  "CamCameraNumber",
  "CamGroupNumber",

  // Weather
  "AirTemp",
  "TrackTemp",
  "TrackTempCrew",
  "WindDir",
  "WindVel",

  // Player information
  "PlayerCarClass",
  "PlayerCarDriverIncidentCount",
  "PlayerCarMyIncidentCount",
  "PlayerCarTeamIncidentCount",
  "PlayerCarIdx",
  "PlayerCarInPitStall",
  "PlayerCarPitSvStatus",
  "PlayerCarTowTime",
  "PlayerTrackSurface",
  "PlayerTrackSurfaceMaterial",

  // Other information?
  "IsOnTrack",
  "IsOnTrackCar",
  "IsInGarage",
  "OnPitRoad",
  "SessionFlags",

  // Pit stop service
  "PitSvFlags",
  "PitSvFuel",
  "PitSvLFP",
  "PitSvRFP",
  "PitSvLRP",
  "PitSvRRP",
  "PitSvTireCompound",

  // Tire sets
  "TireSetsUsed",
  "TireSetsAvailable",
  "FrontTireSetsUsed",
  "FrontTireSetsAvailable",
  "RearTireSetsUsed",
  "RearTireSetsAvailable",
  "LeftTireSetsUsed",
  "LeftTireSetsAvailable",
  "RightTireSetsUsed",
  "RightTireSetsAvailable",
  "RFTireSetsUsed",
  "RFTireSetsAvailable",
  "RRTireSetsUsed",
  "RRTireSetsAvailable",
  "LFTireSetsUsed",
  "LFTireSetsAvailable",
  "LRTireSetsUsed",
  "LRTireSetsAvailable",
];

export const useIRacingSocket = () => {
  const dispatch = useAppDispatch();
  const { server } = useIRacingSocketConnectionContext();

  const connectCallback = useCallback(() => {
    dispatch(
      connect({
        server,
        requestParameters: REQUEST_PARAMETERS,
      }),
    );
  }, [dispatch, server]);

  const disconnectCallback = useCallback(() => {
    dispatch(disconnect());
  }, [dispatch]);

  return {
    connect: connectCallback,
    disconnect: disconnectCallback,
  };
};

export interface IRacingProps {}

export const IRacing: React.FC<PropsWithChildren<IRacingProps>> = ({
  children = null,
}) => {
  const { connect, disconnect } = useIRacingSocket();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return <>{children}</>;
};
