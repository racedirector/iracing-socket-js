import {
  averageFuelUsageResolver,
  carsResolver,
  fuelUsageResolver,
  isAverageUsageReliableResolver,
  lastFuelUsageResolver,
  tracksForCarResolver,
} from './fuelData';

const root = {
  Query: {
    averageFuelUsage: averageFuelUsageResolver,
    cars: carsResolver,
    fuelUsage: fuelUsageResolver,
    isAverageUsageReliable: isAverageUsageReliableResolver,
    lastFuelUsage: lastFuelUsageResolver,
    tracksForCar: tracksForCarResolver,
  },
};

export default root;
