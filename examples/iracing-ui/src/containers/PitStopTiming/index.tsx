import { Heading } from "@chakra-ui/react";
import React from "react";
import { useAppSelector } from "src/app/hooks";
import {
  selectCurrentStopTimingSummary,
  selectPitStopTimingSummary,
} from "src/features/pitStopAnalysisSlice";
import { PitStopTimingDetails } from "../../components/PitStopTimingDetails";

export interface PitStopTimingProps {}

export const PitStopTiming: React.FC<PitStopTimingProps> = () => {
  const timing = useAppSelector(selectPitStopTimingSummary);
  const {
    pitLaneTime: currentPitLaneTime,
    pitStallTime: currentPitStallTime,
    serviceTime: currentServiceTime,
  } = useAppSelector(selectCurrentStopTimingSummary);
  return (
    <>
      <Heading>{`Pit stop timing:`}</Heading>
      <Heading size="md">{`Current stop:`}</Heading>
      <PitStopTimingDetails
        pitLaneTime={currentPitLaneTime}
        pitStallTime={currentPitStallTime}
        serviceTime={currentServiceTime}
      />

      <Heading size="md">{`Previous stop timing:`}</Heading>
      {timing.map(({ pitLaneTime, pitStallTime, serviceTime }) => (
        <PitStopTimingDetails
          pitLaneTime={pitLaneTime}
          pitStallTime={pitStallTime}
          serviceTime={serviceTime}
        />
      ))}
    </>
  );
};

export default PitStopTiming;
