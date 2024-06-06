import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import path = require("path");

export class AppSync extends Construct {
  readonly api: appsync.GraphqlApi;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the GraphQL API for the expense tracker
    this.api = new appsync.GraphqlApi(this, id, {
      name: id,
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, "../../src/api/schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.IAM,
        },
      },
    });
  }
}
