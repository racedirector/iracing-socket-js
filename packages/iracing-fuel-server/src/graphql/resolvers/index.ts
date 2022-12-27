import {
  averageFuelUsageResolver,
  carsResolver,
  fuelUsageResolver,
  isAverageUsageReliableResolver,
  lastFuelUsageResolver,
  tracksForCarResolver,
} from "./fuelData";
import { Resolvers } from "./types";

const resolvers: Resolvers = {
  Query: {
    averageFuelUsage: averageFuelUsageResolver,
    cars: carsResolver,
    fuelUsage: fuelUsageResolver,
    isAverageUsageReliable: isAverageUsageReliableResolver,
    lastFuelUsage: lastFuelUsageResolver,
    tracksForCar: tracksForCarResolver,
  },
};

export default resolvers;
