import os from "os";

export const sourcePath =
  process.env.NODE_ENV === "development" ? "src" : "build";
export const IRacingFuelDataFilePath =
  process.env.IRACING_FUEL_INI ||
  `${os.homedir()}/Documents/iRacing/fueldata.ini`;
export const host = process.env.HOST;
export const port = process.env.PORT;
