import {
  formatTime,
  useDriversByCarIndex,
  useIRacingContext,
} from "@racedirector/iracing-socket-js";
import { chain } from "lodash";
import { useMemo } from "react";

interface StandingsEntry {
  carIndex: number;
  position: number;
  classPosition: number;
  carNumber: number;
  gap: string;
  gapRaw?: number;
  interval: string;
  intervalRaw?: number;
  classId: number;
  bestLapTime: number;
  bestLap: number;
}

interface SessionStandingsEntry extends StandingsEntry {
  name: string;
  id: number;
}

interface UseSessionStandingsProps {
  sessionNumber: number;
}

export const useSessionStandings: (
  props: UseSessionStandingsProps,
) => SessionStandingsEntry[] = ({ sessionNumber }) => {
  const driverIndex = useDriversByCarIndex();
  const {
    data: {
      SessionInfo: { Sessions: sessions = [] } = {},
      WeekendInfo: { TeamRacing: isTeamRacing = false } = {},
    } = {},
  } = useIRacingContext();

  const activeSession = useMemo(
    () => sessions?.[sessionNumber],
    [sessions, sessionNumber],
  );

  const isRace = useMemo(
    () => activeSession?.SessionName === "Race",
    [activeSession],
  );

  const results = useMemo(
    () => activeSession?.ResultsPositions || [],
    [activeSession],
  );

  const sessionLeader = useMemo(() => results?.[0], [results]);

  const standings = useMemo(() => {
    const result = chain(results)
      .map<SessionStandingsEntry>(
        (
          {
            CarIdx,
            ClassPosition,
            Position,
            FastestLap,
            FastestTime,
            LapsComplete,
          },
          index,
          collection,
        ) => {
          const driver = driverIndex[CarIdx];
          const previousPosition = collection?.[index - 1];
          const isLeader = sessionLeader.CarIdx === CarIdx;

          const interval =
            FastestTime > 0 &&
            previousPosition &&
            previousPosition.FastestTime > 0
              ? FastestTime - previousPosition.FastestTime
              : -1;

          const gap = FastestTime - sessionLeader.FastestTime;

          return {
            carIndex: CarIdx,
            position: Position,
            classPosition: ClassPosition,
            carNumber: driver.CarNumberRaw,
            bestLapTime: FastestTime,
            bestLap: FastestLap,
            classId: driver.CarClassID,
            name: isTeamRacing ? driver.TeamName : driver.UserName,
            id: isTeamRacing ? driver.TeamID : driver.UserID,
            gap: "",
            gapRaw: isLeader ? 0 : gap,
            interval: isLeader ? "" : formatTime(interval),
            intervalRaw: isLeader ? 0 : interval,
          };
        },
      )
      .valueOf();

    return result;
  }, [driverIndex, isTeamRacing, results, sessionLeader]);

  return standings;
};

interface QualifyStandingsEntry extends StandingsEntry {
  qualifierName: string;
  qualifierId: number;
}

export const useQualifyStandings = () => {
  const driverIndex = useDriversByCarIndex();
  const {
    data: {
      QualifyResultsInfo: { Results: results = [] } = {},
      WeekendInfo: { TeamRacing: isTeamRacing = false } = {},
    } = {},
  } = useIRacingContext();

  const sessionLeader = useMemo(() => results?.[0], [results]);

  const standings = useMemo(() => {
    return chain(results)
      .map<QualifyStandingsEntry>(
        (
          { CarIdx, ClassPosition, FastestLap, FastestTime, Position },
          index,
          collection,
        ) => {
          const driver = driverIndex[CarIdx];
          const previousPosition = collection?.[index - 1];
          const isLeader = sessionLeader.CarIdx === CarIdx;

          const interval =
            FastestTime > 0 && previousPosition.FastestTime > 0
              ? FastestTime - previousPosition.FastestTime
              : -1;

          return {
            carIndex: CarIdx,
            position: Position,
            classPosition: ClassPosition,
            qualifierName: isTeamRacing ? driver.TeamName : driver.UserName,
            qualifierId: isTeamRacing ? driver.TeamID : driver.UserID,
            carNumber: driver.CarNumberRaw,
            bestLapTime: FastestTime,
            bestLap: FastestLap,
            classId: driver.CarClassID,
            gap: (FastestTime - sessionLeader.FastestTime).toString(),
            interval: isLeader ? "" : formatTime(interval),
          };
        },
      )
      .keyBy("carIndex")
      .valueOf();
  }, [results, driverIndex, sessionLeader, isTeamRacing]);

  return standings;
};
