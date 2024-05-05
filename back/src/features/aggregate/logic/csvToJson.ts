import * as Papa from "papaparse";
import { Expense } from "../types/expense";
import { CustomLogger } from "../utils/customLogger";
import { syncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";

const logger = new CustomLogger();

/**
 * Converts a CSV string to an array of Expense objects.
 */
export class CSVToJson {
  private readonly csvStr: string;

  /**
   * Constructs a new CSVToJson instance.
   * @param csvStr The CSV string to convert.
   */
  constructor(csvStr: string) {
    this.csvStr = csvStr;
  }

  /**
   * Converts the CSV string to an array of Expense objects.
   * @returns An array of Expense objects.
   */
  @syncFuncDecorator
  convert(): Expense[] {
    // Configuration for parsing the CSV
    const parseConfig = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: {
        data: Expense[];
        errors: Papa.ParseError[];
        meta: Papa.ParseMeta;
      }) => {
        logger.info("Parsing complete");
        if (results.errors.length) {
          throw new Error("Errors while parsing:" + JSON.stringify(results));
        }
      },
    };

    const parsed = Papa.parse(this.csvStr, parseConfig);

    // Transform the parsed data
    const transformData = parsed.data.map((expense) => {
      return {
        ...expense,
        // Convert 1 to true and 0 to false
        計算対象: !!expense["計算対象"],
        振替: !!expense["振替"],
      };
    });

    return transformData;
  }
}
