import "graphql-import-node";
import { AddressInfo } from "net";
import http from "http";
import { host, port } from "./constants";
import { createServer } from "./config/express";
import { logger } from "./config/logger";

async function startServer() {
  const app = createServer();
  const server = http.createServer(app).listen({ host, port }, () => {
    const addressInfo = server.address() as AddressInfo;
    logger.info(
      `Server ready at http://${addressInfo.address}:${addressInfo.port}`,
    );
  });

  const signalTraps: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGUSR2"];
  signalTraps.forEach((type) => {
    process.once(type, async () => {
      logger.info(`process.once ${type}`);

      server.close(() => {
        logger.debug("HTTP server closed");
      });
    });
  });
}

startServer();
