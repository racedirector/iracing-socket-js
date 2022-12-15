import express from "express";
import graphQLServerMiddleware from "./graphql";

const createServer = (): express.Application => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/graphql", graphQLServerMiddleware);

  app.disable("x-powered-by");

  app.get("/health", (_req, res) => {
    res.send("UP");
  });

  return app;
};

export { createServer };
