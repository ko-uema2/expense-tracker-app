import { Expense } from "@/features/aggregate/types/expense";
import { syncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";

/**
 * Represents an Expense Calculator.
 */
export class CalcExpense {
  #categoryList: string[];
  #expenseData: Expense[];

  /**
   * Creates an instance of ExpenseCalculator.
   * @param categoryList - The list of categories.
   * @param expenseData - The expense data.
   */
  constructor(categoryList: string[], expenseData: Expense[]) {
    this.#categoryList = categoryList;
    this.#expenseData = expenseData;
  }

  /**
   * Decorated function that calculates the sum of expenses by category.
   * @returns An object with the sum of expenses by category.
   */
  @syncFuncDecorator
  sumByCategory(): { [key: string]: number } {
    const sumByCategory: { [key: string]: number } =
      this.initializeZeroValueObject(this.#categoryList);

    for (const expenseData of this.#expenseData) {
      // Skip if not a calculation target
      if (!expenseData["計算対象"]) continue;
      // Skip if the amount is positive, i.e., income
      if (expenseData["金額（円）"] > 0) continue;

      const category = this.getCategory(expenseData);
      if (category && typeof expenseData["金額（円）"] === "number") {
        sumByCategory[category] += expenseData["金額（円）"];
      }
    }

    // Get the absolute value for each property in sumByCategory
    Object.keys(sumByCategory).forEach((key) => {
      sumByCategory[key] = Math.abs(sumByCategory[key]);
    });

    return sumByCategory;
  }

  /**
   * Initializes an object with zero values for the given keys.
   * @param keys - The keys for the object.
   * @returns An object with zero values for the given keys.
   */
  private initializeZeroValueObject(keys: string[]): { [key: string]: number } {
    return keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  }

  /**
   * Gets the category based on the expense data.
   * @param expenseData - The expense data.
   * @returns The category for the expense data.
   * @throws Error if the category format is invalid.
   */
  private getCategory(expenseData: Expense): string {
    const categoryType = expenseData["中項目"].match(/^[1-4]/)?.[0];
    if (!categoryType) {
      throw new Error(`invalid category format: ${expenseData["中項目"]}`);
    }
    const categoryMap: { [key: string]: string } = {
      "1": "regFixedCost",
      "2": "regVarCost",
      "3": "irregFixedCost",
      "4": "irregVarCost",
    };

    return categoryMap[categoryType];
  }
}
