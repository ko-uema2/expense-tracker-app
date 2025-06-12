import { authErrorDefinition } from "@/features/auth/error/const";
import type { AuthException } from "@/features/auth/error/type";
import { AppError, UnknownError } from "@/utils/error";

export class AuthError extends AppError {
	constructor(code: AuthException) {
		const errorDefinition = authErrorDefinition[code];
		// set default error message if errorDefinition is not found
		if (!errorDefinition) {
			throw new UnknownError();
		}

		const { title, message, errorCode, level } = errorDefinition;

		// set error message
		super(title, message, errorCode, level);

		this.name = "AuthError";
	}
}
