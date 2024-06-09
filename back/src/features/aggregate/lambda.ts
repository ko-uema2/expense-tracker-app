import {
  APPLICATION_ERROR_MESSAGE,
  DYNAMO_DB_TABLE_NAME,
  UNKNOWN_ERROR_MESSAGE,
} from "@/features/aggregate/config/constant";
import { CalcExpense } from "@/features/aggregate/logic/calcExpense";
import { HandleDynamo } from "@/features/aggregate/logic/handleDynamo";
import { HandleExpenseData } from "@/features/aggregate/logic/handleExpenseData";
import { HandleS3Event } from "@/features/aggregate/logic/handleS3Event";
import { HandleSsm } from "@/features/aggregate/logic/handleSsm";
import { CustomLogger } from "@/features/aggregate/utils/customLogger";
import { CheckSsmVar } from "@/features/aggregate/utils/validator/checkSsmVar";
import { Context, S3Event } from "aws-lambda";

const logger = new CustomLogger();

class Handler {
  #s3Event: HandleS3Event;
  #dynamo: HandleDynamo;
  #requiredSsmVars: { [key: string]: string | undefined };

  constructor() {}

  private async init(): Promise<void> {
    // SSMから各種環境変数を取得
    const ssm = new HandleSsm();
    this.#requiredSsmVars = await ssm.getParameters();

    new CheckSsmVar(this.#requiredSsmVars).validate();

    this.#dynamo = new HandleDynamo();
  }

  async handleEvent(event: S3Event, context: Context): Promise<void> {
    logger.info("Lambda invocation event", { event });

    await this.init();

    this.#s3Event = new HandleS3Event(event);

    try {
      const categoryListArray: string[] =
        this.#requiredSsmVars.CATEGORY_LIST!.split(",");

      // get the contents of the CSV file from S3
      const shiftJISByteArray = await this.#s3Event.getCSVContents();
      const csvContents = new TextDecoder("shift-jis").decode(
        shiftJISByteArray
      );

      // Extract the identityId from the S3 obuject key
      const identityId = this.#s3Event.getIdentityId();

      const dataHandler = new HandleExpenseData(csvContents);
      const { jsonExpenseDataArray, expenseDate } = await dataHandler.extract();

      // 支出データを集計
      const sumByCategory = new CalcExpense(
        categoryListArray,
        jsonExpenseDataArray
      ).sumByCategory();

      // DynamoDBへの書き込み
      await this.#dynamo.write(sumByCategory, expenseDate, identityId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(APPLICATION_ERROR_MESSAGE, error);
      } else {
        logger.error(UNKNOWN_ERROR_MESSAGE, error as Error);
      }
    } finally {
      logger.funcEnd(handler.name);
      logger.info("Lambda execution completed.");
    }
  }
}

const handlerInstance = new Handler();
export const handler = (event: S3Event, context: Context) =>
  handlerInstance.handleEvent(event, context);
