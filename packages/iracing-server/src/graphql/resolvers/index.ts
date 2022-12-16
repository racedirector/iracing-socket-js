import 'websocket-polyfill';
import { Resolvers } from './types';
import { logger } from '../../config/logger';
import { iRacingSocket, iRacingSocketEvents } from '@racedirector/iracing-socket-js';

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
      resolve: (payload) => {
        logger.info(`Resolving payload: ${payload}`);
        return payload;
      },
      subscribe: (_, { input: { fps, requestParameters, requestParametersOnce, readIBT } }) => {
        logger.info(`TODO: Creating a socket for kapps...`);

        const socket = new iRacingSocket({
          server: 'localhost:8182',
          fps,
          requestParameters,
          requestParametersOnce,
          readIBT,
        });

        return new Promise((resolve) => {
          socket.on(iRacingSocketEvents.Update, () => {
            const newData = { ...socket.data };
            console.log('Got new data!', newData);

            return newData;
          });
        });
      },
    },
  },
};

export default resolvers;
