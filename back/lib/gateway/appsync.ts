import * as iam from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
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

    // Create an IAM role for the AppSync API
    const appsyncRole = new iam.Role(this, "appsyncRole", {
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
    });

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
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
        role: appsyncRole,
      },
    });

    // Add necessary permissions to the AppSync API execution role
    appsyncRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: [this.api.logGroup.logGroupArn],
      })
    );
  }
}
