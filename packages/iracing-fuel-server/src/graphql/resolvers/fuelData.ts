import { averageFuelData, createFuelParser, parseFuelData } from "../../utils";
import { Resolvers } from "./types";

type QueryResolvers = Resolvers["Query"];

export const carsResolver: QueryResolvers["cars"] = async (): Promise<
  string[]
> => {
  const parser = await createFuelParser();
  return parser.sections();
};

export const tracksForCarResolver: QueryResolvers["tracksForCar"] = async (
  _,
  { carName },
): Promise<string[]> => {
  const parser = await createFuelParser();
  if (parser.isHaveSection(carName)) {
    return parser.options(carName);
  }

  return [];
};

export const isAverageUsageReliableResolver: QueryResolvers["isAverageUsageReliable"] =
  async (_, { input: { track, carName } }): Promise<boolean> => {
    const [numberOfLaps] = parseFuelData(
      await createFuelParser(),
      carName,
      track,
    );
    return numberOfLaps === 5;
  };

export const fuelUsageResolver: QueryResolvers["fuelUsage"] = async (
  _,
  { input: { carName, track } },
): Promise<number[]> => {
  const [, usage] = parseFuelData(await createFuelParser(), carName, track);
  return usage;
};

export const averageFuelUsageResolver: QueryResolvers["averageFuelUsage"] =
  async (_, { input: { track, carName } }): Promise<number | undefined> => {
    const [, usage] = parseFuelData(await createFuelParser(), carName, track);
    return averageFuelData(usage);
  };

export const lastFuelUsageResolver: QueryResolvers["lastFuelUsage"] = async (
  _,
  { input: { track, carName } },
): Promise<number | undefined> => {
  const [, usage] = parseFuelData(await createFuelParser(), carName, track);
  return usage.pop();
};
