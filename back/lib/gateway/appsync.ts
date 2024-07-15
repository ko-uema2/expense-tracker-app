import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import path = require("path");

/**
 * Represents an AppSync construct.
 */
export class AppSync extends Construct {
  /**
   * The GraphQL API for the Expense Tracker App.
   */
  readonly api: appsync.GraphqlApi;

  /**
   * Constructs a new instance of the AppSync class.
   * @param scope - The parent construct that this construct is a part of.
   * @param id - The logical ID of this construct.
   */
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
