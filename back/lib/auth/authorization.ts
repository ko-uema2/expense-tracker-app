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
};

/**
 * Represents the Authorization construct for the Expense Tracker app.
 * This construct creates an identity pool for managing user authentication and authorization.
 */
export class Authorization extends Construct {
  readonly userPool: IUserPoolAuthenticationProvider;
  constructor(scope: Construct, id: string, props: AuthorizationProps) {
    super(scope, id);

    const { userPool } = props;

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
    expenseTrackerIDPool.authenticatedRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSAppSyncInvokeFullAccess")
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
