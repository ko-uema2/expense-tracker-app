import type { StorageException } from "@/features/home/error/type";
import type { ErrorDefinition } from "@/utils/error";

export enum FileUploadException {
	NoCredentials = "NoCredentials",
	ObjectIsTooLarge = "ObjectIsTooLarge",
	UploadFailed = "UploadFailed",
}

export const FILE_UPLOAD_ERROR = {
	[FileUploadException.NoCredentials]: {
		title: "認証エラー",
		message: "認証情報がありません。再度ログインしてください。",
		errorCode: FileUploadException.NoCredentials,
		level: "error",
	},
	[FileUploadException.ObjectIsTooLarge]: {
		title: "オブジェクトサイズエラー",
		message: "アップロードするオブジェクトが大きすぎます。",
		errorCode: FileUploadException.ObjectIsTooLarge,
		level: "error",
	},
	[FileUploadException.UploadFailed]: {
		title: "アップロード失敗",
		message: "アップロードに失敗しました。",
		errorCode: FileUploadException.UploadFailed,
		level: "error",
	},
} as const;

export const STORAGE_ERROR = {
	...FILE_UPLOAD_ERROR,
} as const;

export const storageErrorDefinition = Object.fromEntries(
	Object.entries(STORAGE_ERROR).map(([, value]) => [value.errorCode, value]),
) as Record<StorageException, ErrorDefinition<StorageException>>;
