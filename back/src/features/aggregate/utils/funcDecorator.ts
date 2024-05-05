import { UNKNOWN_ERROR_MESSAGE } from "@/features/aggregate/config/constant";
import { AppError } from "@/features/aggregate/utils/appError";
import { CustomLogger } from "@/features/aggregate/utils/customLogger";

const logger = new CustomLogger();

export const asyncFuncDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    logger.funcStart(propertyKey);

    let result: any;
    try {
      result = await originalMethod.apply(this, args);
      logger.funcEnd(propertyKey);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(propertyKey, error.message);
      } else {
        throw new AppError(propertyKey, UNKNOWN_ERROR_MESSAGE);
      }
    } finally {
    }
  };
  return descriptor;
};

export const syncFuncDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    logger.funcStart(propertyKey);

    let result: any;
    try {
      result = originalMethod.apply(this, args);
      logger.funcEnd(propertyKey);
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(propertyKey, error.message);
      } else {
        throw new AppError(propertyKey, UNKNOWN_ERROR_MESSAGE);
      }
    } finally {
    }
  };
  return descriptor;
};
