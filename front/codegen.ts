
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../back/src/api/schema.graphql",
  documents: "src/**/*.ts",
  generates: {
    "src/graphql": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
