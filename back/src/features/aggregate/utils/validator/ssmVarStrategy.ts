import { CategoryListValidationPolicy } from "@/features/aggregate/utils/validator/ssmVarPolicy";

/**
 * Enum representing the SSM variables.
 */
export enum SsmVar {
  CATEGORY_LIST = "CATEGORY_LIST",
}

/**
 * Interface for defining the SSM variable validation strategy.
 */
export interface SsmVarValidationStrategy {
  /**
   * Checks if the given SSM variable is valid.
   * @param ssmVar - The SSM variable to be checked.
   * @returns A boolean indicating whether the SSM variable is valid or not.
   */
  checkSsmVar: (ssmVar: string | undefined) => boolean;
}

/**
 * Class representing the validation strategy for the category list SSM variable.
 * Implements the SsmVarValidationStrategy interface.
 */
export class CategoryListValidationStrategy
  implements SsmVarValidationStrategy
{
  /**
   * Checks if the given SSM variable is a valid category list.
   * @param ssmVar - The SSM variable to be checked.
   * @returns A boolean indicating whether the SSM variable is a valid category list or not.
   */
  checkSsmVar(ssmVar: string | undefined): boolean {
    const policy = new CategoryListValidationPolicy();
    return policy.checkCategoryList(ssmVar);
  }
}

/**
 * Object representing the mapping of SSM variables to their respective validation strategies.
 */
export const strategyMap: { [key in SsmVar]: SsmVarValidationStrategy } = {
  [SsmVar.CATEGORY_LIST]: new CategoryListValidationStrategy(),
};
