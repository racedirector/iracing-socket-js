import 'websocket-polyfill';
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
    // legacySubscription: {
    //   resolve: (payload) => {
    //     logger.info(`Resolving payload: ${payload}`);
    //     return payload;
    //   },
    // subscribe: async (_, _args) => {
    //   logger.debug(`TODO: Creating a socket for kapps... ${args}`);
    //   return new Promise((resolve) =>
    //     resolve(
    //       new Promise((resolve) => {
    //         resolve({ data: '' });
    //       }),
    //     ),
    //   );
    // },
    // },
  },
};

export default resolvers;
