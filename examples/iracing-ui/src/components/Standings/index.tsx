import React from "react";
import { Tabs, TabList, Tab } from "@chakra-ui/react";
import SessionStandings, { SessionStandingsProps } from "../SessionStandings";

interface Sessions {
  name: string;
  number: number;
}

export interface StandingsProps
  extends Pick<SessionStandingsProps, "standings" | "isMulticlass"> {
  sessions: Sessions[];
  onSetSessionNumber: (sessionNumber: number) => void;
}

export const Standings: React.FC<StandingsProps> = ({
  sessions,
  standings,
  isMulticlass,
  onSetSessionNumber,
}) => {
  return (
    <>
      <Tabs onChange={(index) => onSetSessionNumber(index)}>
        <TabList>
          {sessions.map(({ name, number }) => (
            <Tab key={`${name}-${number.toString()}`}>{name}</Tab>
          ))}
        </TabList>
      </Tabs>
      <SessionStandings standings={standings} isMulticlass={isMulticlass} />
    </>
  );
};

export default Standings;
