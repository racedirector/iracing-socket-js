import React, { PropsWithChildren, useEffect } from "react";
import { connect, disconnect } from "@racedirector/iracing-socket-js";
import { useAppDispatch } from "src/app/hooks";

const REQUEST_PARAMETERS = [
  "CameraInfo",
  "CamCarIdx",
  "CamCameraNumber",
  "CamGroupNumber",
  "DriverInfo",
  "QualifyResultsInfo",
  "SessionInfo",
  "SplitTimeInfo",
  "WeekendInfo",
  "CarIdxSessionFlags",
  "CarIdxLapDistPct",
  "SessionNum",
  "SessionTime",
  "SessionTick",
  "SessionTimeOfDay",
  "SessionTimeRemain",
  "SessionState",

  "Lap",
  "LapCompleted",

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
];

export interface IRacingProps {}

export const IRacing: React.FC<PropsWithChildren<IRacingProps>> = ({
  children = null,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Connect socket explicitly");
    dispatch(
      connect({
        server: "192.168.4.52:8182",
        requestParameters: REQUEST_PARAMETERS,
      }),
    );

    return () => {
      console.log("Disconnect socket explicitly...");
      dispatch(disconnect());
    };
  }, [dispatch]);

  return <>{children}</>;
};
