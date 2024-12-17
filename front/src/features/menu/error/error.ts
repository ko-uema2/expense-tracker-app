import {
	type FileUploadException,
	storageErrorDefinition,
} from "@/features/menu/error";
import { AppError, UnknownError } from "@/utils/error";

export class StorageError extends AppError {
	constructor(code: FileUploadException) {
		const errorDefinition = storageErrorDefinition[code];
		const { title, message, errorCode, level } = errorDefinition;

		if (!errorDefinition) {
			throw new UnknownError();
		}

		super(title, message, errorCode, level);

		this.name = "StorageError";
	}
}
