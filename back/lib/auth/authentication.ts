import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

/**
 * Represents the Authentication class for the Expense Tracker App.
 * This class creates a user pool for managing user authentication.
 */
export class Authentication extends Construct {
  /**
   * The user pool for the Expense Tracker App.
   */
  public readonly userPool: cognito.UserPool;

  /**
   * Constructs a new instance of the Authentication class.
   * @param scope The parent construct.
   * @param id The construct ID.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    /**
     * Represents the user pool for the Expense Tracker App.
     */
    this.userPool = new cognito.UserPool(this, "ExpenseTrackerUserPool", {
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
    });
  }
}
