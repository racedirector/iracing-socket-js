import React from "react";
import { HStack } from "@chakra-ui/react";
import {
  SessionClassDetailsCard,
  SessionClassDetailsCardProps,
} from "../SessionClassDetailsCard";

export interface SessionClassDetailsProps {
  classDetails: SessionClassDetailsCardProps[];
}

export const SessionClassDetails: React.FC<SessionClassDetailsProps> = ({
  classDetails,
}) => {
  return (
    <HStack>
      {classDetails.map((props) => {
        return <SessionClassDetailsCard key={props.className} {...props} />;
      })}
    </HStack>
  );
};

export default SessionClassDetails;
