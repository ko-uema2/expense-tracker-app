import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

/**
 * Represents a DynamoDB table for expense data.
 */
export class DynamoDB extends Construct {
  /**
   * The DynamoDB table for storing expense data.
   */
  readonly table: dynamodb.TableV2;

  /**
   * Constructs a new instance of the DynamoDB class.
   * @param scope The parent construct.
   * @param id  The construct ID.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the DynamoDB table for expense data
    this.table = new dynamodb.TableV2(this, id, {
      tableName: id,
      partitionKey: {
        name: "userId",
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
  }
}
