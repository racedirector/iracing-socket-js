import "websocket-polyfill";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  iRacingClientConnectionEvents,
  iRacingSocket,
  iRacingSocketConnectionEvents,
} from "@racedirector/iracing-socket-js";
import { createLogger, transports } from "winston";
import { LapConsumer, LapEvents } from "./lapsEmitter";

const { host, fps, output, verbose } = yargs(hideBin(process.argv))
  .usage("Usage: iracing-laps [options]")
  .example(
    "iracing-laps --host 192.168.4.33:8182 --fps 1 --output output.txt",
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
    verbose: {
      type: "boolean",
      default: false,
      description: "Log updates to the console?",
    },
  })
  .help("h")
  .alias("h", "help")
  .parseSync();

console.log(host, fps, output, verbose);

const consoleTransport = new transports.Console();

// All socket updates will go here. By default, they will go to the console.
const socketUpdateLogger = createLogger({
  level: "info",
  defaultMeta: { service: "iracing-laps-cli", name: "socket-update" },
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
  defaultMeta: { service: "iracing-laps-cli", name: "socket-meta" },
  transports: [consoleTransport],
});

// Set up a new socket with the given options that writes it's update
// event meta to `socketMetaLogger`, and the details of the update
// to the `socketUpdateLogger`.
const socket = new iRacingSocket({
  fps,
  server: host,
  requestParameters: LapConsumer.requestParameters,
  requestParametersOnce: LapConsumer.requestParametersOnce,
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

const consumer = new LapConsumer(socket);
consumer.on(
  LapEvents.LapChange,
  (currentLap, greenLaps, cautionLaps, restartLaps) => {
    socketUpdateLogger.info({
      currentLap,
      greenLaps,
      cautionLaps,
      restartLaps,
    });
  },
);
