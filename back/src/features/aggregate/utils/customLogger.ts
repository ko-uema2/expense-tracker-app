import { Logger } from "@aws-lambda-powertools/logger";

export class CustomLogger extends Logger {
  funcStart(funcName: string, params?: any) {
    super.debug(`Function ${funcName} start.`, params);
  }

  funcEnd(funcName: string, params?: any) {
    super.debug(`Function ${funcName} end.`, params);
  }
}
