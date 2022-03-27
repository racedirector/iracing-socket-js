import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { iRacingSocket } from "@racedirector/iracing-socket-js";
import SocketDataConsumer from "./socketDataConsumer";

const { host, request, requestOnce, fps, output } = yargs(hideBin(process.argv))
  .usage("Usage: $0 [options]")
  .example(
    "$0 --host 192.168.4.33:8182 --request DriverInfo, SessionInfo --requestOnce WeekendInfo --fps 1 --output output.txt",
    "Connect to `host` and send `request`, `requestOnce`, and `fps` in the initial request, writing all responses to `output`",
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
    request: {
      type: "array",
      alias: ["r", "req"],
      demandOption: true,
      string: true,
      description: "the properties to request from the server",
    },
    requestOnce: {
      type: "array",
      alias: ["rO", "once"],
      default: [],
      string: true,
      description: "the properties to request once from the server",
    },
    // TODO: Figure out a smart way to parse out a txt location, json location, or just stdout
    output: {
      type: "string",
      alias: ["o", "out"],
      description: "the location to output updates from the server",
    },
  })
  .help("h")
  .alias("h", "help")
  .parseSync();

// Set up a new socket with the given options...
const socket = new iRacingSocket({
  fps,
  server: host,
  requestParameters: request,
  requestParametersOnce: requestOnce,
});

// Give the socket to the consumer...
const consumer = new SocketDataConsumer(socket, {
  outputPath: output,
});

// Notify the client that it's g2g
console.log("Successfully set up consumer!", consumer);
