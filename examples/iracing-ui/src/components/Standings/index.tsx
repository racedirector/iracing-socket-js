import React from "react";
import { Tabs, TabList, Tab } from "@chakra-ui/react";
import SessionStandings, { SessionStandingsProps } from "../SessionStandings";

interface Sessions {
  name: string;
  number: number;
}

export interface StandingsProps
  extends Pick<SessionStandingsProps, "standings" | "isMulticlass"> {
  sessionNumber: number;
  sessions: Sessions[];
  onSetSessionNumber: (sessionNumber: number) => void;
  onPress: (carNumber: number) => void;
}

export const Standings: React.FC<StandingsProps> = ({
  sessions,
  sessionNumber,
  standings,
  isMulticlass,
  onPress = () => {},
  onSetSessionNumber,
}) => {
  return (
    <>
      <Tabs
        index={sessionNumber}
        onChange={(index) => onSetSessionNumber(index)}
      >
        <TabList>
          {sessions.map(({ name, number }) => (
            <Tab key={`${name}-${number.toString()}`}>{name}</Tab>
          ))}
        </TabList>
      </Tabs>
      <SessionStandings
        standings={standings}
        isMulticlass={isMulticlass}
        onPress={onPress}
      />
    </>
  );
};

export default Standings;
