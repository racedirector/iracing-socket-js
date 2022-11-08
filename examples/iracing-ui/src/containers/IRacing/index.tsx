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
    dispatch(
      connectAction({
        server: "192.168.4.52:8182",
        requestParameters: [
          "CameraInfo",
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
          "SessionState",

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
        ],
      }),
    );

    return () => {
      console.log("Disconnect socket explicitly...");
      dispatch(disconnectAction());
    };
  }, [dispatch]);

  return <>{children}</>;
};
