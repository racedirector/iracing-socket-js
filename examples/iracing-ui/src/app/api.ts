import { createApi } from "@reduxjs/toolkit/query/react";
import {
  Driver,
  iRacingData,
  iRacingSocket,
  iRacingSocketEvents,
} from "@racedirector/iracing-socket-js";
import REQUEST_PARAMETERS from "src/constants/socketRequestParameters";
import { isEmpty } from "lodash";

export const api = createApi({
  reducerPath: "iRacingData",
  baseQuery: () => ({ data: {} }),
  endpoints: (build) => ({
    getActiveDrivers: build.query<Driver[], void>({
      queryFn() {
        console.log("Getting active drivers");

        // TODO: Issue a query against the YAML file... probably need to fix the socket.
        const socket = new iRacingSocket({
          server: "localhost:8888",
          requestParameters: [],
          requestParametersOnce: ["DriverInfo"],
          fps: 1,
        });

        socket.on(iRacingSocketEvents.Update, () => {
          console.log("Got initial data", socket.data);
          // TODO: Find some way to return this
          socket.close();
        });

        socket.open();

        return { data: [] };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        console.log("Added cache entry!");
        const socket = new iRacingSocket({
          server: "localhost:8888",
          requestParameters: ["DriverInfo"],
          fps: 3,
        });

        try {
          await cacheDataLoaded;

          socket.on(iRacingSocketEvents.Update, () => {
            console.log("Socket data update");
            updateCachedData((draft) => ({
              ...draft,
              ...socket?.data,
            }));
          });

          socket.open();
        } catch {
          // no op
        }

        await cacheEntryRemoved;

        socket.close();
      },
    }),
    getIRacingData: build.query<iRacingData, void>({
      query: () => "iracing",
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const socket = new iRacingSocket({
          server: "localhost:8888",
          requestParameters: REQUEST_PARAMETERS,
          fps: 3,
        });

        try {
          await cacheDataLoaded;

          socket.on(iRacingSocketEvents.Update, (keys: string[]) => {
            const newEntries = Object.entries(socket?.data || {}).filter(
              ([key]) => keys.includes(key),
            );

            // ???: Should we split channels up here? Can we have subscribers? idk

            const newData = Object.fromEntries(newEntries);
            if (!isEmpty(newData)) {
              updateCachedData((draft) => ({
                ...draft,
                ...newData,
              }));
            }
          });

          socket.open();
        } catch {
          // no op
        }

        await cacheEntryRemoved;

        socket.close();
      },
    }),
  }),
});

export const { useGetIRacingDataQuery, useGetActiveDriversQuery } = api;
