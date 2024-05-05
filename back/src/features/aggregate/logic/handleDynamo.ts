import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { DYNAMO_DB_TABLE_NAME } from "@/features/aggregate/config/constant";
import { asyncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";

/**
 * Class representing a handler for DynamoDB operations.
 */
export class HandleDynamo {
  #dynamoDBDocumentClient: DynamoDBDocumentClient;
  #tableName: string;

  /**
   * Creates an instance of HandleDynamo.
   * @param requiredSsmVars - Required environment variables.
   */
  constructor() {
    this.#dynamoDBDocumentClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: "ap-northeast-1" })
    );
    this.#tableName = DYNAMO_DB_TABLE_NAME!;
  }

  /**
   * Writes the aggregated expenses to DynamoDB.
   * @param sumByCategory - The aggregated expenses by category.
   * @param expenseDate - The date of the expenses.
   */
  @asyncFuncDecorator
  async write(sumByCategory: { [key: string]: number }, expenseDate: string) {
    // Write data to DynamoDB
    await this.#dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: this.#tableName,
        Item: {
          id: uuidv4(),
          userId: "user1", // TODO: Replace with the actual user ID
          expenseDate: expenseDate,
          ...sumByCategory,
        },
      })
    );
  }
}
