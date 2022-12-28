import { createApi } from "@reduxjs/toolkit/query/react";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
  iRacingSocketEvents,
} from "@racedirector/iracing-socket-js";
import { pick } from "lodash";

const fuelSocket = new iRacingSocket({
  server: "192.168.4.52:8182",
  requestParameters: [
    "FuelLevel",
    "LapDistPct",
    "PlayerTrackSurface",
    "IsOnTrack",
    "IsInGarage",
    "OnPitRoad",
    "SessionState",
    "SessionFlags",
    "SessionNumber",
    "SessionTime",
    "SessionTimeRemain",
  ],
  requestParametersOnce: ["SplitTimeInfo", "DriverInfo"],
  fps: 10,
  autoconnect: false,
});

const socketConnectedForSocket = (socket: iRacingSocket) =>
  new Promise((resolve) => {
    socket.socketConnectionEmitter.on(
      iRacingSocketConnectionEvents.Connect,
      resolve,
    );
  });

const iRacingClientConnectedForSocket = (socket: iRacingSocket) =>
  new Promise((resolve) => {
    fuelSocket.iRacingConnectionEmitter.on(
      iRacingClientConnectionEvents.Connect,
      resolve,
    );
  });

const socketConnected = socketConnectedForSocket(fuelSocket);
const iRacingConnected = socketConnectedForSocket(fuelSocket);
const socketReady = Promise.all([socketConnected, iRacingConnected]);

interface FuelClientState {
  pastUsage: number[];
  lapStarted: boolean;
  lapChanged: boolean;
  lastFuelLevel: number;
}

const customBaseQuery = (
  args,
  { signal, dispatch, getState },
  extraOptions,
) => {
  return { data: "nice" };
};

export const fuelClientApi = createApi({
  reducerPath: "fuelClient",
  baseQuery: customBaseQuery,
  endpoints: (build) => ({
    getFuelData: build.query<FuelClientState, void>({
      queryFn() {
        console.log("Getting fuel data...");

        return {
          data: {
            pastUsage: [],
            lapStarted: false,
            lapChanged: false,
            lastFuelLevel: 0,
          },
        };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // Wait for data load
        await cacheDataLoaded;

        let previousLapDistance = -1;
        // Add a new listener for the socket
        fuelSocket.on(iRacingSocketEvents.Update, (keys) => {
          const changedData = pick(fuelSocket.data, keys);

          if (keys.includes("LapDistPct")) {
            const nextLapDistance = changedData["LapDistPct"];
            if (previousLapDistance >= 0) {
              if (previousLapDistance > 0.9 && nextLapDistance < 0.1) {
                updateCachedData((draft) => ({
                  ...draft,
                  lapChanged: draft.lapStarted,
                  lastFuelLevel: !draft.lapStarted
                    ? fuelSocket.data.FuelLevel
                    : draft.lastFuelLevel,
                  lapStarted: true,
                }));
              }
            }

            previousLapDistance = nextLapDistance;
          }
          // updateCachedData((draft) => ({
          //   ...draft,
          //   ...changedData,
          // }));
        });

        // If the socket isn't already opened, open it
        if (!fuelSocket.connected) {
          fuelSocket.open();
        }

        await cacheEntryRemoved;
        fuelSocket.close();
      },
    }),
  }),
});

export const { useGetFuelDataQuery } = fuelClientApi;
