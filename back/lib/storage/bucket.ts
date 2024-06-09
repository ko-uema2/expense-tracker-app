import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class S3Bucket extends Construct {
  readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the S3 bucket for expense data
    this.bucket = new s3.Bucket(this, id, {
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
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

    // Add the bucket policy to the expense data bucket
    this.bucket.addToResourcePolicy(AllowCSVUploadOnlyPolicy);
  }
}
