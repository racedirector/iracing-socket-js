import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "packages/iracing-server/src/graphql/resolvers/types.ts": {
      schema: "packages/iracing-server/src/graphql/schema.graphql",
      plugins: ["typescript", "typescript-resolvers"],
    },
    "packages/iracing-fuel-server/src/graphql/resolvers/types.ts": {
      schema: "packages/iracing-fuel-server/src/graphql/schema.graphql",
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./graphql.schema.json": {
      schema: "packages/iracing-mesh/.mesh/schema.graphql",
      plugins: ["introspection"],
    },
  },
};

export default config;
