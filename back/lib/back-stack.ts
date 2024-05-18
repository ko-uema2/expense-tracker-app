/**
 * Represents the AWS CDK stack for the backend of the expense tracker app.
 */
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import path = require("path");
import { Authentication } from "lib/auth";
import {
  IdentityPool,
  IdentityPoolProviderUrl,
  IdentityPoolRoleMapping,
  RoleMappingRule,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";

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
    const aggregateLambda = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "AggregateLambda",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "../src/features/aggregate/lambda.ts"),
        role: aggregateLambdaExecutionRole,
        environment: {
          POWERTOOLS_SERVICE_NAME: "ExpenseTrackerApp",
          CATEGORY_LIST: "ExpenseTrackerApp-categoryList",
          DYNAMO_DB_TABLE_NAME: "ExpenseData",
        },
        tracing: lambda.Tracing.ACTIVE,
        loggingFormat: lambda.LoggingFormat.JSON,
        applicationLogLevel: lambda.ApplicationLogLevel.INFO,
        systemLogLevel: lambda.SystemLogLevel.INFO,
        timeout: cdk.Duration.seconds(10),
      }
    );

    // Add necessary permissions to the aggregate lambda function
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

    // Create the S3 bucket for expense data
    const expenseDataBucket = new s3.Bucket(this, "ExpenseDataBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
    });

    // Define the bucket policy to deny PutObject action for CSV files
    const expenseDataBucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ["s3:PutObject"],
      notResources: [`arn:aws:s3:::${expenseDataBucket.bucketName}/*.csv`],
    });

    // Add the bucket policy to the expense data bucket
    expenseDataBucket.addToResourcePolicy(expenseDataBucketPolicy);

    // Add event notification to the expense data bucket
    expenseDataBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new cdk.aws_s3_notifications.LambdaDestination(aggregateLambda)
    );

    // Create the DynamoDB table for expense data
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

    // Create the GraphQL API for the expense tracker
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

    // Add DynamoDB data source to the GraphQL API
    const expenseDataSource = expenseTrackerAPi.addDynamoDbDataSource(
      "ExpenseDataSource",
      ExpenseDataTable
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

    // const expenseTrackerAuthentication = new Authentication(
    //   this,
    //   "Authentication"
    // );

    // const expenseTrackerAuthorization = new Authorization(
    //   this,
    //   "Authorization",
    //   {
    //     userPools: [],
    //     roleMappings: [],
    //   }
    // );

    /**
     * Represents the user pool for the Expense Tracker App.
     */
    const expenseTrackerUserPool = new cognito.UserPool(
      this,
      "ExpenseTrackerUserPool",
      {
        userPoolName: "ExpenseTrackerUserPool",
        selfSignUpEnabled: true,
        userVerification: {
          emailSubject: "Verify your email for Expense Tracker App",
          emailBody:
            "Hello {username}, Thanks for signing up to Expense Tracker App! Your verification code is {####}",
          emailStyle: cognito.VerificationEmailStyle.CODE,
        },
        signInAliases: {
          email: true,
        },
        standardAttributes: {
          email: {
            required: true,
            mutable: true,
          },
        },
        passwordPolicy: {
          minLength: 8,
          requireLowercase: true,
          requireDigits: true,
          requireSymbols: true,
          requireUppercase: true,
          tempPasswordValidity: cdk.Duration.days(7),
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    const expenseTrackerUserPoolClient = expenseTrackerUserPool.addClient(
      "ExpenseTrackerUserPoolClient",
      {
        userPoolClientName: "ExpenseTrackerUserPoolClient",
        authFlows: {
          userPassword: true,
          userSrp: true,
          adminUserPassword: true,
        },
      }
    );

    /**
     * Represents the identity pool for the Expense Tracker app.
     */
    const expenseTrackerIDPool = new IdentityPool(
      this,
      "ExpenseTrackerIDPool",
      {
        identityPoolName: "ExpenseTrackerIDPool",
        allowUnauthenticatedIdentities: true,
        authenticationProviders: {
          userPools: [
            new UserPoolAuthenticationProvider({
              userPool: expenseTrackerUserPool,
            }),
          ],
        },
      }
    );

    // const FederatedPrincipal = new iam.FederatedPrincipal(
    //   "cognito-identity.amazonaws.com",
    //   {
    //     StringEquals: {
    //       "cognito-identity.amazonaws.com:aud":
    //         expenseTrackerIDPool.identityPoolId,
    //     },
    //     "ForAnyValue:StringLike": {
    //       "cognito-identity.amazonaws.com:amr": "authenticated",
    //     },
    //   }
    // );

    // const expenseTrackerAuthenticatedRole = new iam.Role(
    //   this,
    //   "ExpenseTrackerAuthenticatedRole",
    //   {
    //     roleName: "ExpenseTrackerAuthenticatedRole",
    //     assumedBy: FederatedPrincipal,
    //   }
    // );

    // const authenticatedRMP: RoleMappingRule = {
    //   claim: "cognito:groups",
    //   claimValue: "authenticated",
    //   mappedRole: expenseTrackerAuthenticatedRole,
    // };

    // const roleMapping: IdentityPoolRoleMapping = {
    //   providerUrl: IdentityPoolProviderUrl.userPool(
    //     expenseTrackerUserPool,
    //     expenseTrackerUserPoolClient
    //   ),
    //   mappingKey: "ExpenseTrackerApp",
    //   resolveAmbiguousRoles: false,
    //   useToken: false,
    //   rules: [authenticatedRMP],
    // };

    // expenseTrackerIDPool.addRoleMappings(roleMapping);

    // new cognito.CfnUserPoolGroup(this, "ExpenseTrackerAuthenticatedGroup", {
    //   userPoolId: expenseTrackerUserPool.userPoolId,
    //   groupName: "expenseTrackerAuthenticatedGroup",
    //   roleArn: expenseTrackerAuthenticatedRole.roleArn,
    // });

    // const authenticatedRMP: RoleMappingRule = {
    //   claim: "cognito:groups",
    //   claimValue: "authenticated",
    //   mappedRole: expenseTrackerAuthenticatedRole,
    // };

    // const identityPoolRoleAttachment = new IdentityPoolRoleAttachment(
    //   this,
    //   "IdentityPoolRoleAttachment",
    //   {
    //     identityPool: expenseTrackerIDPool,
    //     authenticatedRole: expenseTrackerAuthenticatedRole,
    //   }
    // );
  }
}
