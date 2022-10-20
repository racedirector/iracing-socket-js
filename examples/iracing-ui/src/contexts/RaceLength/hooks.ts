import { useContext } from "react";
import invariant from "ts-invariant";
import { getRaceLengthContext } from "./context";

export const useRaceLength = () => {
  const context = useContext(getRaceLengthContext());
  invariant(!!context, "Wrap the root component in a <RaceLengthProvider>");
  return context;
};
