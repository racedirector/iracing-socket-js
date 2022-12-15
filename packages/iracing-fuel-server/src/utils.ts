import { ConfigIniParser } from 'config-ini-parser';
import fs from 'fs';
import { IRacingFuelDataFilePath } from './constants';

// Convert the value from the .ini file to a usable array of numbers.
// The first value in the array represents the number of "valid" fuel
// usage laps we have. The following 5 values represent fuel usage.
export const normalizeFuelDataString = (dataString = ''): [number, number[]] => {
  const [numberOfLaps = 0, ...fuelData] = dataString
    .split(',')
    .filter((entry) => entry.trim() != '')
    .map((number) => parseFloat(number));

  return [numberOfLaps, fuelData.slice(0, numberOfLaps)];
};

export const createFuelParser = async (): Promise<ConfigIniParser> => {
  const fuelDataFileContent = await fs.promises.readFile(IRacingFuelDataFilePath, 'utf-8');
  const parser = new ConfigIniParser();
  parser.parse(fuelDataFileContent);
  return parser;
};

export const parseFuelDataString = (parser: ConfigIniParser, carName: string, track: string): string | undefined => {
  return parser.isHaveOption(carName, track) ? parser.get(carName, track) : undefined;
};

export const parseFuelData = (parser: ConfigIniParser, carName: string, track: string): [number, number[]] =>
  normalizeFuelDataString(parseFuelDataString(parser, carName, track));

export const averageFuelData = (usage: number[]): number | undefined => {
  if (usage.length > 0) {
    const averageUsage = usage.reduce((averageUsage, usage) => averageUsage + usage, 0) / usage.length;
    return parseFloat(averageUsage.toFixed(2));
  }

  return undefined;
};
