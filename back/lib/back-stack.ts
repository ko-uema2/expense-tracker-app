import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import { Authentication, Authorization } from "./auth";
import { Lambda } from "./logic";
import { AppSync } from "./gateway";
import { DynamoDB, S3Bucket } from "./storage";
import { NagSuppressions } from "cdk-nag";

export class BackStack extends cdk.Stack {
  /**
   * Constructs a new instance of the `BackStack` class.
   *
   * @param scope - The parent construct.
   * @param id - The identifier for the construct.
   * @param props - The optional stack properties.
   */
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const expenseDataBucket = new S3Bucket(this, "ExpenseDataBucket");

    const aggregate = new Lambda(this, "Aggregate", expenseDataBucket.bucket);

    // Add event notification to the expense data bucket
    expenseDataBucket.bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new cdk.aws_s3_notifications.LambdaDestination(aggregate.lambda)
    );

    // Create the DynamoDB table for expense data
    const expenseDataTable = new DynamoDB(this, "ExpenseDataTable");

    // Create the AppSync API for the Expense Tracker App
    const expenseTracker = new AppSync(this, "ExpenseTrackerAPI");

    // Add DynamoDB data source to the GraphQL API
    const expenseDataSource = expenseTracker.api.addDynamoDbDataSource(
      "ExpenseDataSource",
      expenseDataTable.table
    );

    // Create resolver for the getExpData query
    expenseDataSource.createResolver("getExpData", {
      typeName: "Query",
      fieldName: "getExpData",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbQuery(
        appsync.KeyCondition.eq("userId", "userId"),
        "expenseDataByUser"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    });

    // Create the user pool for the Expense Tracker App.
    const expenseTrackerAuthentication = new Authentication(
      this,
      "Authentication"
    );

    const expenseTrackerAuthorization = new Authorization(
      this,
      "Authorization",
      {
        userPool: expenseTrackerAuthentication.userPool,
        bucketArn: expenseDataBucket.bucket.bucketArn,
        appsyncArn: expenseTracker.api.arn,
      }
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/Aggregate/AggregateLambdaExecutionRole/DefaultPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "To allow the Lambda function to access any object within the bucket.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/ExpenseDataBucket/ExpenseDataBucket-NotificationHandlerRole/Resource",
      [
        {
          id: "AwsSolutions-IAM4",
          reason:
            "To allow the AWSLambdaBasicExecutionRole to be used because that role is granted automatically.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/ExpenseDataBucket/ExpenseDataBucket-NotificationHandlerRole/DefaultPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Because we cannot specify the log group ARN in the IAM policy, as we are unable to identity the log gruup ARN.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/ExpenseTrackerAPI/appsyncRole/DefaultPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Because we cannot specify the log group ARN in the IAM policy, as we are unable to identity the log group ARN.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/ExpenseTrackerAPI/ExpenseTrackerAPI/ExpenseDataSource/ServiceRole/DefaultPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Because it is necessary to allow DynamoDB actions on the entire local secondary index.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource",
      [
        {
          id: "AwsSolutions-IAM4",
          reason:
            "To allow the AWSLambdaBasicExecutionRole to be used because that role is granted automatically.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Because we cannot identify the relevant IAM role and cannnot overwite the default policy.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/Authorization/ExpenseTrackerIDPool/Resource",
      [
        {
          id: "AwsSolutions-COG7",
          reason: "To implement the guest login feature in the application.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/Authorization/AuthenticatedPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "To grant permissions for all operations within the specified AppSync API.",
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "/ExpenseTrackerBackendStack/Authorization/UnauthenticatedPolicy/Resource",
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "To grant permissions for all operations within the specified AppSync API.",
        },
      ]
    );
  }
}
