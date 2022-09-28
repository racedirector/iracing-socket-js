import React, { useCallback, useMemo } from "react";
import {
  iRacingSocketCommands,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import {
  Drivers as DriversUI,
  DriversProps as DriversUIProps,
} from "src/components/DriversTable";

export interface DriversProps {}

export const Drivers: React.FC<DriversProps> = () => {
  const {
    sendCommand,
    data: {
      DriverInfo: { Drivers = [] } = {},
      CamCameraNumber: cameraNumber = -1,
      CamGroupNumber: cameraGroupNumber = -1,
      CarIdxClassPosition: classPositionIndex = [],
      CarIdxPosition: positionIndex = [],
      CarIdxBestLapTime: lapTimeIndex = [],
      CarIdxSessionFlags: flagsIndex = [],
    } = {},
  } = useIRacingContext();

  const onPressDriverCallback = useCallback(
    (carIndex) => {
      sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
        carIndex.toString(),
        cameraGroupNumber,
        cameraNumber,
      ]);
    },
    [cameraGroupNumber, cameraNumber, sendCommand],
  );

  const drivers = useMemo<DriversUIProps["drivers"]>(() => {
    return Drivers.map(
      ({
        UserName,
        CarNumber,
        CarNumberRaw,
        CurDriverIncidentCount,
        TeamIncidentCount,
        CarIdx,
      }) => {
        return {
          userName: UserName,
          carNumber: CarNumber,
          carNumberRaw: CarNumberRaw,
          incidentCount: CurDriverIncidentCount,
          teamIncidentCount: TeamIncidentCount,
          bestLapTime: lapTimeIndex[CarIdx],
          position: positionIndex[CarIdx],
          classPosition: classPositionIndex[CarIdx],
          flags: flagsIndex[CarIdx],
        };
      },
    );
  }, [Drivers, classPositionIndex, flagsIndex, lapTimeIndex, positionIndex]);

  return <DriversUI drivers={drivers} onPressDriver={onPressDriverCallback} />;
};
