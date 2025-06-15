import type { AppError } from "@/utils/error";

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
			payload: FailurePayload;
	  };

// アップロード対象ファイルの状態
export type FileState = {
	fileName: string;
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

// ファイルアップロード全体の状態
export type States = {
	files: FileState[];
};

// アップロード失敗時のpayload型
export type FailurePayload =
	| { fileNames: string; error: AppError }
	| { fileNames: string[]; error: AppError };
