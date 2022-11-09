import React from "react";
import { SessionClassDetails } from "../SessionClassDetails";
import { TrackMap } from "../TrackMap";

export interface SessionInformationProps {}

export const SessionInformation: React.FC<SessionInformationProps> = () => {
  return (
    <>
      <SessionClassDetails />
      <TrackMap />
    </>
  );
};
