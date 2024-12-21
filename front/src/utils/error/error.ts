import type { errorLevel } from "@/utils/error";

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
