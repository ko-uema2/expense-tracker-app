import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class ExpenseDataBucket extends Construct {
  readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the S3 bucket for expense data
    this.bucket = new s3.Bucket(this, id, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true,
    });

    // Define the bucket policy to deny PutObject action for CSV files
    const expenseDataBucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ["s3:PutObject"],
      notResources: [`arn:aws:s3:::${this.bucket.bucketName}/*.csv`],
    });

    // Add the bucket policy to the expense data bucket
    this.bucket.addToResourcePolicy(expenseDataBucketPolicy);
  }
}
