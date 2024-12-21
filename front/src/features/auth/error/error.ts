import {
	type AuthErrorNames,
	authErrorDefinition,
} from "@/features/auth/error";
import { AppError, UnknownError } from "@/utils/error";

export class AuthError extends AppError {
	constructor(code: AuthErrorNames) {
		const errorDefinition = authErrorDefinition[code];
		const { title, message, errorCode, level } = errorDefinition;

		// set default error message if errorDefinition is not found
		if (!errorDefinition) {
			throw new UnknownError();
		}

		// set error message
		super(title, message, errorCode, level);

		this.name = "AuthError";
	}
}
