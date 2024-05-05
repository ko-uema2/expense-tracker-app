/**
 * Represents a rule for validating SSM variables.
 */
interface SsmVarRule {
  /**
   * Checks if the given SSM variable is valid according to this rule.
   * @param ssmVar - The SSM variable to be checked.
   * @returns `true` if the SSM variable is valid, `false` otherwise.
   */
  check: (ssmVar: string | undefined) => boolean;
}

export class NotEmptyValidationRule implements SsmVarRule {
  /**
   * Checks if the given SSM variable is not empty.
   * @param ssmVar - The SSM variable to be checked.
   * @returns `true` if the SSM variable is not empty, `false` otherwise.
   */
  check(ssmVar: string | undefined): boolean {
    return ssmVar !== "";
  }
}

export class NotUndefinedValidationRule implements SsmVarRule {
  /**
   * Checks if the given SSM variable is not undefined.
   * @param ssmVar - The SSM variable to be checked.
   * @returns `true` if the SSM variable is not undefined, `false` otherwise.
   */
  check(ssmVar: string | undefined): boolean {
    return ssmVar !== undefined;
  }
}

export class CommaSeparatedStringValidationRule implements SsmVarRule {
  /**
   * Checks if the given SSM variable is a comma-separated string.
   * @param ssmVar - The SSM variable to be checked.
   * @returns `true` if the SSM variable is a comma-separated string, `false` otherwise.
   */
  check(ssmVar: string | undefined): boolean {
    const regex = /^[^,]+(,[^,]+)*$/;
    return ssmVar ? regex.test(ssmVar) : false;
  }
}

class SsmVarPolicy {
  #rules: SsmVarRule[];

  constructor(rules: SsmVarRule[]) {
    this.#rules = rules;
  }

  /**
   * Checks if the given SSM variable passes all the validation rules.
   * @param ssmVar - The SSM variable to be validated.
   * @returns A boolean indicating whether the SSM variable is valid or not.
   */
  checkAllRule(ssmVar: string | undefined): boolean {
    for (const rule of this.#rules) {
      if (!rule.check(ssmVar)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Represents a validation policy for category list.
 * Extends the SsmVarPolicy class.
 */
export class CategoryListValidationPolicy extends SsmVarPolicy {
  constructor() {
    super([
      new NotEmptyValidationRule(),
      new NotUndefinedValidationRule(),
      new CommaSeparatedStringValidationRule(),
    ]);
  }

  /**
   * Checks if the given category list string passes all the validation rules.
   * @param ssmVar - The category list string to be validated.
   * @returns A boolean indicating whether the category list is valid or not.
   */
  checkCategoryList(ssmVar: string | undefined): boolean {
    return this.checkAllRule(ssmVar);
  }
}
