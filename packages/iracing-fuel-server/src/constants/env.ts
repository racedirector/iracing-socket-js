import os from 'os';

export const IRacingFuelDataFilePath = process.env.IRACING_FUEL_INI || `${os.homedir()}/Documents/iRacing/fueldata.ini`;
export const host = process.env.HOST || '0.0.0.0';
export const port = process.env.PORT || '5000';
