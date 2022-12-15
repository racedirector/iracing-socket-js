import { averageFuelData, createFuelParser, parseFuelData } from '../../utils';

export const carsResolver = async (): Promise<string[]> => {
  const parser = await createFuelParser();
  return parser.sections();
};

export const tracksForCarResolver = async (_, { carName }): Promise<string[]> => {
  const parser = await createFuelParser();
  if (parser.isHaveSection(carName)) {
    return parser.options(carName);
  }

  return [];
};

export const isAverageUsageReliableResolver = async (_, { input: { track, carName } }): Promise<boolean> => {
  const [numberOfLaps] = parseFuelData(await createFuelParser(), carName, track);
  return numberOfLaps === 5;
};

export const fuelUsageResolver = async (_, { input: { carName, track } }): Promise<number[]> => {
  const [, usage] = parseFuelData(await createFuelParser(), carName, track);
  return usage;
};

export const averageFuelUsageResolver = async (_, { input: { track, carName } }): Promise<number | undefined> => {
  const [, usage] = parseFuelData(await createFuelParser(), carName, track);
  return averageFuelData(usage);
};

export const lastFuelUsageResolver = async (_, { input: { track, carName } }): Promise<number | undefined> => {
  const [, usage] = parseFuelData(await createFuelParser(), carName, track);
  return usage.pop();
};
