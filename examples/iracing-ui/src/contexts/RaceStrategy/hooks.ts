import { useContext } from "react";
import invariant from "ts-invariant";
import { getRaceStrategyContext } from "./context";

export const useRaceStrategy = () => {
  const context = useContext(getRaceStrategyContext());
  invariant(!!context, "Wrap the root component in an <RaceStrategyProvider>");
  return context;
};
