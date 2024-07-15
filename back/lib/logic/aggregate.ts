import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import path = require("path");

/**
 * Represents a Lambda construct.
 */
export class Lambda extends Construct {
  readonly lambda: cdk.aws_lambda_nodejs.NodejsFunction;

  /**
   * Constructs a new instance of the Lambda class.
   * @param scope The parent construct.
   * @param id The logical ID of the construct.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the IAM role for the aggregate lambda function
    const aggregateLambdaExecutionRole = new iam.Role(
      this,
      "AggregateLambdaExecutionRole",
      {
        roleName: "AggregateLambdaExecutionRole",
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "CloudWatchLogsFullAccess"
          ),
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "AWSXrayDaemonWriteAccess"
          ),
        ],
      }
    );

    // Create the aggregate lambda function
    this.lambda = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "AggregateLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "../../src/features/aggregate/lambda.ts"),
        role: aggregateLambdaExecutionRole,
        environment: {
          POWERTOOLS_SERVICE_NAME: "ExpenseTrackerApp",
          CATEGORY_LIST: "ExpenseTrackerApp-categoryList",
          DYNAMO_DB_TABLE_NAME: "ExpenseDataTable",
        },
        tracing: lambda.Tracing.ACTIVE,
        loggingFormat: lambda.LoggingFormat.JSON,
        applicationLogLevel: lambda.ApplicationLogLevel.INFO,
        systemLogLevel: lambda.SystemLogLevel.INFO,
        timeout: cdk.Duration.seconds(10),
      }
    );

    // Add necessary permissions to the aggregate lambda function
    this.lambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        resources: [
          cdk.Fn.sub(
            "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/ExpenseDataTable"
          ),
          // `arn:aws:dynamodb:${cdk.Stack.of(this).region}:${
          //   cdk.Stack.of(this).account
          // }:table/ExpenseDataTable`,
        ],
      })
    );
  }
}
