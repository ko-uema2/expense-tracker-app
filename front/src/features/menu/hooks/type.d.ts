import type { AppError } from "@/utils/error";

// Define the shape of the state object
export type FileState = {
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

export type States = {
	files: Record<string, FileState>;
};

// Define the shape of the action object
export type Action =
	| {
			type: "FILE_UPLOAD_INIT";
	  }
	| {
			type: "FILE_UPLOAD_START";
			payload: string;
	  }
	| {
			type: "FILE_UPLOAD_SUCCESS";
			payload: string;
	  }
	| {
			type: "FILE_UPLOAD_FAILURE";
			payload: { fileName: string; error: AppError };
	  };
