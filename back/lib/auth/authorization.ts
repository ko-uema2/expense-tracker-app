import {
  IUserPoolAuthenticationProvider,
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

type AuthorizationProps = {
  userPool: cognito.UserPool;
  bucketArn: string;
  appsyncArn: string;
};

/**
 * Represents the authorization component of the Expense Tracker app.
 * This class creates a user pool client, an identity pool, roles for authenticated and unauthenticated users,
 * and groups for authenticated and unauthenticated users.
 */
export class Authorization extends Construct {
  /**
   * Represents the user pool for authentication.
   */
  readonly userPool: IUserPoolAuthenticationProvider;

  /**
   * Constructs a new instance of the Authorization class.
   * @param scope - The construct scope.
   * @param id - The construct ID.
   * @param props - The authorization properties.
   */
  constructor(scope: Construct, id: string, props: AuthorizationProps) {
    super(scope, id);

    const { userPool, bucketArn, appsyncArn } = props;

    // create a user pool client for the Expense Tracker app
    const expenseTrackerUserPoolClient = userPool.addClient(
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

    this.userPool = new UserPoolAuthenticationProvider({
      userPool,
      userPoolClient: expenseTrackerUserPoolClient,
    });

    // create an identity pool for the Expense Tracker app
    const expenseTrackerIDPool = new IdentityPool(
      this,
      "ExpenseTrackerIDPool",
      {
        identityPoolName: "ExpenseTrackerIDPool",
        allowUnauthenticatedIdentities: true,
        authenticationProviders: {
          userPools: [this.userPool],
        },
      }
    );

    // create a role for authenticated users
    const appSyncInvokePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["appsync:GraphQL"],
      resources: [appsyncArn + "/*"],
    });

    const s3UploadPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:PutObject"],
      resources: [
        bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    });

    const authenticatedPolicy = new iam.Policy(this, "AuthenticatedPolicy", {
      policyName: "AuthenticatedPolicy",
      statements: [appSyncInvokePolicy, s3UploadPolicy],
    });

    expenseTrackerIDPool.authenticatedRole.attachInlinePolicy(
      authenticatedPolicy
    );

    // create a role for unauthenticated users
    expenseTrackerIDPool.unauthenticatedRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSAppSyncInvokeFullAccess")
    );

    // create a group for authenticated users
    new cognito.CfnUserPoolGroup(this, "ExpenseTrackerAuthenticatedGroup", {
      userPoolId: userPool.userPoolId,
      groupName: "expenseTrackerAuthenticatedGroup",
      roleArn: expenseTrackerIDPool.authenticatedRole.roleArn,
    });

    // create a group for unauthenticated users
    new cognito.CfnUserPoolGroup(this, "ExpenseTrackerUnauthenticatedGroup", {
      userPoolId: userPool.userPoolId,
      groupName: "expenseTrackerUnauthenticatedGroup",
      roleArn: expenseTrackerIDPool.unauthenticatedRole.roleArn,
    });
  }
}
