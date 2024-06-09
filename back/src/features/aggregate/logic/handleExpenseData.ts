import {
  EXPENSE_DATA_ARRAY_EMPTY,
  INVALID_DATE_FORMAT,
} from "@/features/aggregate/config/constant";
import { CSVToJson } from "@/features/aggregate/logic/csvToJson";
import { Expense } from "@/features/aggregate/types/expense";
import { syncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";

/**
 * Represents a class that extracts expense data from a CSV string.
 */
export class HandleExpenseData {
  private readonly csvStr: string;

  /**
   * Constructs a new instance of ExpenseDataExtractor.
   * @param csvStr The CSV string containing the expense data.
   */
  constructor(csvStr: string) {
    this.csvStr = csvStr;
  }

  /**
   * Extracts the expense data from the CSV string and returns the JSON expense data array and the extracted date.
   * @returns An object containing the JSON expense data array and the extracted date.
   */
  @syncFuncDecorator
  extract(): {
    jsonExpenseDataArray: Expense[];
    expenseDate: string;
  } {
    // csvファイルからJSONオブジェクトを生成
    const csvToJson = new CSVToJson(this.csvStr);
    const jsonExpenseDataArray = csvToJson.convert();

    // csvデータの日付を取得
    const expenseDate = this.extractExpenseMonth(jsonExpenseDataArray);

    return { jsonExpenseDataArray, expenseDate };
  }

  /**
   * Extracts the year and month from the expense data array.
   * @param expenseDataArray The array of expense data.
   * @returns The extracted year and month in the format "YYYY-MM".
   * @throws Error if the expense data array is empty or if the date format is invalid.
   */
  private extractExpenseMonth(expenseDataArray: Expense[]): string {
    // ガード節
    if (!expenseDataArray.length) {
      throw new Error(EXPENSE_DATA_ARRAY_EMPTY);
    }

    // 日付から年と月を抽出
    const dateRegex = /(\d{4})\/(\d{2})\/\d{2}/;
    const match = expenseDataArray[0]["日付"].match(dateRegex);

    if (!match) {
      throw new Error(INVALID_DATE_FORMAT);
    }

    // 年と月をハイフンで結合
    const yearAndMonth = `${match[1]}-${match[2]}`;

    return yearAndMonth;
  }
}
