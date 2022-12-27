import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    "packages/iracing-fuel-server/src/graphql/resolvers/types.ts": {
      schema: "packages/iracing-fuel-server/src/graphql/schema.graphql",
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
