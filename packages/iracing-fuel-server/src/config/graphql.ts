import { createYoga, createSchema } from "graphql-yoga";
import resolvers from "../graphql/resolvers";
import typeDefs from "../graphql/schema";

export default createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphiql: true,
});
