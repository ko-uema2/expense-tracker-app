import type { errorLevel } from "@/utils/error";
import {
	type GeneralException,
	generalErrorDefinition,
} from "@/utils/error/const";

export class AppError extends Error {
	public readonly title: string;
	public readonly code: string;
	public readonly level: errorLevel;

	constructor(title: string, message: string, code: string, level: errorLevel) {
		super(message);
		this.title = title;
		this.code = code;
		this.level = level;
	}
}

export class GeneralError extends AppError {
	constructor(code: GeneralException) {
		const errorDefinition = generalErrorDefinition[code];
		// set default error message if errorDefinition is not found
		if (!errorDefinition) {
			console.log(
				`Error definition for code ${code} not found. Using default error.`,)
			throw new UnknownError();
		}

		const { title, message, errorCode, level } = errorDefinition;

		// set error message
		super(title, message, errorCode, level);

		this.name = "GeneralError";
	}
}

export class NoError extends AppError {
	public readonly name: string;

	constructor() {
		super("", "", "", "none");
		this.name = "NoError";
	}
}

export class UnknownError extends AppError {
	public readonly name: string;

	constructor() {
		super(
			"Unknown Error",
			"An unknown error occurred.",
			"UnknownException",
			"error",
		);
		this.name = "UnknownError";
	}
}
