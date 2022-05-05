import "websocket-polyfill";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
} from "@racedirector/iracing-socket-js";
import { createLogger, transports } from "winston";
import { FlagsEmitter, FlagsEvents } from "./flagsEmitter";

const { host, fps, output } = yargs(hideBin(process.argv))
  .usage("Usage: iracing-flags [options]")
  .example(
    "iracing-flags --host 192.168.4.33:8182 --fps 1 --output output.txt",
    "Connect to `host` and writes all responses to `output`",
  )
  .options({
    host: {
      type: "string",
      demandOption: true,
      description:
        "the iRacingBrowserApps/server.exe or Kapps host to connect to.",
    },
    fps: {
      type: "number",
      alias: ["f"],
      default: 1,
      description: "the rate at which to get updates from the server",
    },
    output: {
      type: "string",
      alias: ["o", "out"],
      description: "the location to output updates from the server",
    },
  })
  .help("h")
  .alias("h", "help")
  .parseSync();

const consoleTransport = new transports.Console();

// All socket updates will go here. By default, they will go to the console.
const socketUpdateLogger = createLogger({
  level: "info",
  defaultMeta: { service: "iracing-flags-cli", name: "socket-update" },
  transports: [
    consoleTransport,
    output ? new transports.File({ filename: output }) : null,
  ].filter(Boolean),
});

// All events related to socket/iracing connection/error and meta information
// about the socket update information will go here. This only goes to the
// console
// TODO: Add support for argv.logOutput and create a transport for the file
const socketMetaLogger = createLogger({
  level: "info",
  defaultMeta: { service: "iracing-flags-cli", name: "socket-meta" },
  transports: [consoleTransport],
});

// Set up a new socket with the given options that writes it's update
// event meta to `socketMetaLogger`, and the details of the update
// to the `socketUpdateLogger`.
const socket = new iRacingSocket({
  fps,
  server: host,
  requestParameters: FlagsEmitter.requestParameters,
  requestParametersOnce: FlagsEmitter.requestParametersOnce,
});

socketMetaLogger.info("Successfully set up socket!");

// Update `socketMetaLogger` of `iRacingSocketConnectionEvents`
socket.socketConnectionEmitter
  .on(iRacingSocketConnectionEvents.Connect, () => {
    socketMetaLogger.info("Socket connected");
  })
  .on(iRacingSocketConnectionEvents.Disconnect, () => {
    socketMetaLogger.info("Socket disconnected");
  })
  .on(iRacingSocketConnectionEvents.Error, (error) => {
    socketMetaLogger.error("Socket error:", error);
  });

// Update `socketMetaLogger of `iRacingClientConnectionEvents`
socket.iRacingConnectionEmitter
  .on(iRacingClientConnectionEvents.Connect, () => {
    socketMetaLogger.info("iRacing connected");
  })
  .on(iRacingClientConnectionEvents.Disconnect, () => {
    socketMetaLogger.info("iRacing disconnected");
  });

const flagsEmitter = new FlagsEmitter(socket);
flagsEmitter
  .on(
    FlagsEvents.FlagChange,
    (previousFlags, nextFlags, sessionTime, sessionTimeOfDay) => {
      socketUpdateLogger.info({
        event: FlagsEvents.FlagChange,
        previousFlags,
        nextFlags,
        sessionTime,
        sessionTimeOfDay,
      });
    },
  )
  .on(
    FlagsEvents.FlagIndexChange,
    (updateIndex, sessionTime, sessionTimeOfDay) => {
      socketUpdateLogger.info({
        event: FlagsEvents.FlagIndexChange,
        updateIndex,
        sessionTime,
        sessionTimeOfDay,
      });
    },
  )
  .on(FlagsEvents.BlackFlag, (carIndexes) => {
    socketUpdateLogger.info({
      event: FlagsEvents.BlackFlag,
      carIndexes,
    });
  })
  .on(FlagsEvents.Meatball, (carIndexes) => {
    socketUpdateLogger.info({
      event: FlagsEvents.Meatball,
      carIndexes,
    });
  })
  .on(FlagsEvents.DQ, (carIndexes) => {
    socketUpdateLogger.info({
      event: FlagsEvents.DQ,
      carIndexes,
    });
  })
  .on(FlagsEvents.Serviceible, (carIndexes) => {
    socketUpdateLogger.info({
      event: FlagsEvents.Serviceible,
      carIndexes,
    });
  })
  .on(FlagsEvents.Furled, (carIndexes) => {
    socketUpdateLogger.info({
      event: FlagsEvents.Furled,
      carIndexes,
    });
  });
