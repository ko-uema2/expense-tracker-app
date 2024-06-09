import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as appsync from "aws-cdk-lib/aws-appsync";
import { Construct } from "constructs";
import { Authentication, Authorization } from "./auth";
import { Lambda } from "./logic";
import { AppSync } from "./gateway";
import { DynamoDB, S3Bucket } from "./storage";

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

    const aggregate = new Lambda(this, "Aggregate");

    const expenseDataBucket = new S3Bucket(this, "ExpenseDataBucket");

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
  }
}
