import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path = require("path");

export class BackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    const aggregateLambda = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "AggregateLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "../src/features/aggregate/lambda.ts"),
        role: aggregateLambdaExecutionRole,
        environment: {
          POWERTOOLS_SERVICE_NAME: "ExpenseTrackerApp",
          POWERTOOLS_LOG_LEVEL: "DEBUG",
          CATEGORY_LIST: "ExpenseTrackerApp-categoryList",
          DYNAMO_DB_TABLE_NAME: "ExpenseData",
        },
        tracing: lambda.Tracing.ACTIVE,
        timeout: cdk.Duration.seconds(10),
      }
    );

    aggregateLambda.addToRolePolicy(
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
            "arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/ExpenseData"
          ),
        ],
      })
    );

    const expenseDataBucket = new s3.Bucket(this, "ExpenseDataBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
    });

    const expenseDataBucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ["s3:PutObject"],
      notResources: [`arn:aws:s3:::${expenseDataBucket.bucketName}/*.csv`],
    });

    expenseDataBucket.addToResourcePolicy(expenseDataBucketPolicy);

    expenseDataBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new cdk.aws_s3_notifications.LambdaDestination(aggregateLambda)
    );

    const ExpenseDataTable = new dynamodb.TableV2(this, "ExpenseDataTable", {
      tableName: "ExpenseData",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "expenseDate",
        type: dynamodb.AttributeType.STRING,
      },
      globalSecondaryIndexes: [
        {
          indexName: "expenseDataByUser",
          partitionKey: {
            name: "userId",
            type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
            name: "expenseDate",
            type: dynamodb.AttributeType.STRING,
          },
        },
      ],
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const expenseTrackerAPi = new appsync.GraphqlApi(
      this,
      "ExpenseTrackerAPI",
      {
        name: "ExpenseTrackerAPI",
        schema: appsync.SchemaFile.fromAsset(
          path.join(__dirname, "../src/api/schema.graphql")
        ),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        },
      }
    );

    const expenseDataSource = expenseTrackerAPi.addDynamoDbDataSource(
      "ExpenseDataSource",
      ExpenseDataTable
    );

    expenseDataSource.createResolver("getExpData", {
      typeName: "Query",
      fieldName: "getExpData",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbQuery(
        appsync.KeyCondition.eq("userId", "userId"),
        "expenseDataByUser"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
  }
}
