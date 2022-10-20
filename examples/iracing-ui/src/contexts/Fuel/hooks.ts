import { useContext } from "react";
import invariant from "ts-invariant";
import { getFuelContext } from "./context";

export const useFuel = () => {
  const context = useContext(getFuelContext());
  invariant(!!context, "Wrap the root component in an <FuelProvider>");
  return context;
};
