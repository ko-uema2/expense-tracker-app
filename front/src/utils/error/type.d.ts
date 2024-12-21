export type errorLevel =
	| "fatal"
	| "error"
	| "warning"
	| "info"
	| "debug"
	| "none";

export type ErrorDefinition<T extends string> = {
	title: string;
	message: string;
	errorCode: T;
	level: errorLevel;
};
