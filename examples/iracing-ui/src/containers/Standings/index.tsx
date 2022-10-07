import React, { useState, useMemo } from "react";
import {
  useDriversByCarIndex,
  useIRacingContext,
  useStandingsForSession,
  useIsMulticlass,
  SessionResultsPosition,
  SessionState,
} from "@racedirector/iracing-socket-js";
import { useSessionStandings } from "../../hooks/useStandings";
import {
  Standings as StandingsUI,
  StandingsProps as StandingsUIProps,
} from "../../components/Standings";

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
  const [sessionNumber, setSessionNumber] = useState(0);
  const {
    data: {
      SessionState: sessionState,
      SessionInfo: { Sessions = [] } = {},
    } = {},
  } = useIRacingContext();
  const standingsResult = useSessionStandings({ sessionNumber });
  const driverIndex = useDriversByCarIndex();
  const isMulticlass = useIsMulticlass();

  const sessions = useMemo(
    () =>
      Sessions.map(({ SessionType, SessionNum }) => ({
        name: SessionType,
        number: SessionNum,
      })),
    [Sessions],
  );

  // const standings = useMemo<StandingsUIProps["standings"]>(() => {
  //   const sessionLeader = standingsResult?.[0];
  //   const currentSession = Sessions?.[sessionNumber];
  //   if (!sessionLeader || !currentSession) {
  //     return [];
  //   }

  //   const isRace = currentSession?.SessionName === "RACE";

  //   return standingsResult.map(
  //     ({
  //       ClassPosition,
  //       Position,
  //       CarIdx,
  //       FastestTime,
  //       Time,
  //       LapsComplete,
  //     }) => {
  //       const driver = driverIndex[CarIdx];

  //       let gap = -1;
  //       if (isRace) {
  //         gap = Time - sessionLeader.Time;
  //       } else if (FastestTime > 0) {
  //         gap = FastestTime - sessionLeader.FastestTime;
  //       }

  //       const lapDifference = sessionLeader.LapsComplete - LapsComplete;

  //       return {
  //         gain: 0,
  //         carNumber: driver.CarNumberRaw,
  //         classPosition: ClassPosition + 1,
  //         position: Position,
  //         interval: "0",
  //         gap: stringForGap(
  //           sessionLeader,
  //           gap,
  //           lapDifference,
  //           isRace,
  //           sessionState,
  //         ),
  //         name: driver.UserName,
  //       };
  //     },
  //   );
  // }, [Sessions, driverIndex, sessionNumber, sessionState, standingsResult]);

  return (
    <StandingsUI
      isMulticlass={isMulticlass}
      sessions={sessions}
      onSetSessionNumber={setSessionNumber}
      standings={standingsResult}
    />
  );
};
