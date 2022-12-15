import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
export default buildSchema(`
  input FuelUsageInputType {
    carName: String!
    track: String!
  }

  type Query {
    averageFuelUsage(input: FuelUsageInputType!): Float!
    cars: [String!]!
    fuelUsage(input: FuelUsageInputType!): [Float!]!
    isAverageUsageReliable(input: FuelUsageInputType!): Boolean!
    lastFuelUsage(input: FuelUsageInputType!): Float
    tracksForCar(carName: String!): [String!]!
  }
`);
