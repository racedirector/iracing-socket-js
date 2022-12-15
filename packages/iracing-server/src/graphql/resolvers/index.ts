import { logger } from '../../config/logger';
import { Resolvers } from './types';

const resolvers: Resolvers = {
  Query: {
    currentDriver: async () => {
      return {
        carIndex: 64,
        carNumber: '64',
        carNumberRaw: 64,
        userId: 378767,
        userName: 'Justin Makaila',
        teamId: -1,
        teamName: '',
      };
    },
  },
  Subscription: {
    legacySubscription: {
      resolve: () => ({ data: JSON.stringify({ someData: 123 }) }),
      subscribe: async function* (_, { input: { fps, requestParameters, requestParametersOnce, readIBT } }) {
        logger.info(`TODO: Creating a socket for kapps...`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        yield {
          data: JSON.stringify({
            fps,
            requestParameters,
          }),
        };
      },
    },
  },
};

export default resolvers;
