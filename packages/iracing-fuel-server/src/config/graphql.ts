import { createYoga, createSchema } from "graphql-yoga";
import resolvers from "../graphql/resolvers";
import * as typeDefs from "../graphql/schema.graphql";

export default createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphiql: true,
});
