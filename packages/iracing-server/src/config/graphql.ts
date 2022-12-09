import { createYoga, createSchema } from 'graphql-yoga';
import schema from '../graphql/schema';
import resolvers from '../graphql/resolvers';

export default createYoga({
  schema: createSchema({
    typeDefs: schema,
    resolvers,
  }),
  graphiql: true,
});
