import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

/**
 * Represents an S3 bucket for storing expense data.
 */
export class S3Bucket extends Construct {
  /**
   * The S3 bucket for storing expense data.
   */
  readonly bucket: s3.Bucket;

  /**
   * Constructs a new instance of the S3Bucket class.
   * @param scope The parent construct.
   * @param id The construct ID.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the S3 bucket for server access logs
    const accessLogsBucket = new s3.Bucket(this, `${id}-AccessLogs`, {
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create the S3 bucket for expense data
    this.bucket = new s3.Bucket(this, id, {
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      serverAccessLogsBucket: accessLogsBucket,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      cors: [
        {
          allowedHeaders: ["*"],
          allowedOrigins: ["http://localhost:5173"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          exposedHeaders: ["ETag"],
        },
      ],
    });

    // Define the bucket policy to allow PutObject action for CSV files only
    const AllowCSVUploadOnlyPolicy = new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ["s3:PutObject"],
      notResources: [
        `${this.bucket.bucketArn}/*/*.csv`,
        `${this.bucket.bucketArn}/*/`,
      ],
    });

    // Define the bucket policy to allow only encrypted connections over HTTPS
    const EnforceHttpsOnlyPolicy = new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      actions: ["s3:*"],
      resources: [`${this.bucket.bucketArn}`, `${this.bucket.bucketArn}/*`],
      principals: [new iam.AnyPrincipal()],
      conditions: {
        Bool: {
          "aws:SecureTransport": "false",
        },
      },
    });

    const EnforceHttpsOnlyPolicyForAccessLogBucket = new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      actions: ["s3:*"],
      resources: [
        `${accessLogsBucket.bucketArn}`,
        `${accessLogsBucket.bucketArn}/*`,
      ],
      principals: [new iam.AnyPrincipal()],
      conditions: {
        Bool: {
          "aws:SecureTransport": "false",
        },
      },
    });

    // Add the bucket policy to the expense data bucket
    this.bucket.addToResourcePolicy(AllowCSVUploadOnlyPolicy);
    this.bucket.addToResourcePolicy(EnforceHttpsOnlyPolicy);

    accessLogsBucket.addToResourcePolicy(
      EnforceHttpsOnlyPolicyForAccessLogBucket
    );
  }
}
