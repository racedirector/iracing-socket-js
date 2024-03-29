import React, { useState, useMemo } from "react";
import {
  useDriversByCarIndex,
  SessionResultsPosition,
  SessionState,
  selectIsMulticlass,
} from "@racedirector/iracing-socket-js";
import { useSessionStandings } from "../../hooks/useStandings";
import {
  Standings as StandingsUI,
  StandingsProps as StandingsUIProps,
} from "../../components/Standings";
import { useAppSelector, useIRacingContext } from "src/app/hooks";

const stringForGap = (
  sessionLeader: SessionResultsPosition,
  timeGap: number,
  lapDifference: number,
  isRace: boolean,
  sessionState: SessionState,
) => {
  if (isRace) {
    if (timeGap >= 0) {
      if (
        lapDifference <= 0 ||
        (lapDifference === 1 && sessionLeader.LastTime === -1) ||
        timeGap < sessionLeader.LastTime
      ) {
        // TODO: Format the time difference
      } else if (
        sessionState < SessionState.Checkered &&
        lapDifference > 0 &&
        sessionLeader.LastTime !== -1 &&
        Math.ceil(timeGap / sessionLeader.LastTime) === lapDifference
      ) {
        return `${lapDifference - 1}L`;
      } else if (lapDifference > 0) {
        return `${lapDifference}L`;
      }
    } else if (lapDifference > 1) {
      return `${lapDifference}L`;
    } else {
      return "";
    }
  } else {
    if (timeGap >= 0) {
      // TODO: Format the time difference
    } else {
      return "";
    }
  }
};

export interface StandingsProps {}

export const Standings: React.FC<StandingsProps> = () => {
  const {
    data: {
      CamCameraNumber: cameraNumber = -1,
      CamGroupNumber: cameraGroupNumber = -1,
      SessionInfo: { Sessions = [] } = {},
      SessionNum,
    } = {},
  } = useIRacingContext();
  const [sessionNumber, setSessionNumber] = useState(SessionNum);
  const driverIndex = useDriversByCarIndex();
  const standingsResult = useSessionStandings({ sessionNumber });
  const isMulticlass = useAppSelector((state) =>
    selectIsMulticlass(state.iRacing),
  );

  const sessions = useMemo(
    () =>
      Sessions.map(({ SessionType, SessionNum }) => ({
        name: SessionType,
        number: SessionNum,
      })),
    [Sessions],
  );

  const standings: StandingsUIProps["standings"] = useMemo(() => {
    return standingsResult.map((standingsEntry) => {
      const driver = driverIndex[standingsEntry.carIndex];
      return { ...standingsEntry, classColor: driver.CarClassColor };
    });
  }, [driverIndex, standingsResult]);

  // const onPressCallback = useCallback(
  //   (carNumber) => {
  //     // sendCommand(iRacingSocketCommands.CameraSwitchNumber, [
  //     //   carNumber.toString(),
  //     //   cameraGroupNumber,
  //     //   cameraNumber,
  //     // ]);
  //   },
  //   [cameraGroupNumber, cameraNumber, sendCommand],
  // );

  return (
    <StandingsUI
      sessionNumber={sessionNumber}
      isMulticlass={isMulticlass}
      sessions={sessions}
      standings={standings}
      onSetSessionNumber={setSessionNumber}
      onPress={console.log}
    />
  );
};
