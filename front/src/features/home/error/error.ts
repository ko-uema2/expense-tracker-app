import { storageErrorDefinition } from "@/features/home/error/const";
import type { StorageException } from "@/features/home/error/type";
import { AppError, UnknownError } from "@/utils/error";

export class StorageError extends AppError {
	constructor(code: StorageException) {
		const errorDefinition = storageErrorDefinition[code];
		// set default error message if errorDefinition is not found
		if (!errorDefinition) {
			throw new UnknownError();
		}

		const { title, message, errorCode, level } = errorDefinition;

		// set error message
		super(title, message, errorCode, level);

		this.name = "StorageError";
	}
}
