import { syncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";
import {
  SsmVar,
  SsmVarValidationStrategy,
  strategyMap,
} from "@/features/aggregate/utils/validator/ssmVarStrategy";

/**
 * Represents a class that checks the validity of SSM variables.
 */
export class CheckSsmVar {
  #invalidSsmVar: { [key: string]: string | undefined } = {};
  #requiredSsmVars: { [key: string]: string | undefined };
  #strategyMap: { [key in SsmVar]: SsmVarValidationStrategy } = strategyMap;

  /**
   * Creates an instance of CheckSsmVar.
   * @param requiredSsmVars - The required SSM variables to be validated.
   */
  constructor(requiredSsmVars: { [key: string]: string | undefined }) {
    this.#requiredSsmVars = requiredSsmVars;
  }

  /**
   * Validates the SSM variables.
   * @throws {Error} If a strategy for a specific SSM variable is not found, or if there are invalid environment variables.
   */
  @syncFuncDecorator
  validate(): void {
    // 各SSM変数に対応するバリデーション戦略を使ってバリデーションを実施
    for (const [key, value] of Object.entries(this.#requiredSsmVars)) {
      const ssmVarStrategy = this.#strategyMap[key as SsmVar];

      if (!ssmVarStrategy) {
        throw new Error(`Strategy not found: ${key}`);
      }

      if (!ssmVarStrategy.checkSsmVar(value)) {
        this.#invalidSsmVar[key] = value;
      }
    }

    // 不正なSSM変数がある場合はエラーをスロー
    if (Object.keys(this.#invalidSsmVar).length > 0) {
      throw new Error(
        `Invalid environment variables: ${Object.keys(this.#invalidSsmVar).join(
          ", "
        )}`
      );
    }
  }
}
