import type { ErrorDefinition, errorLevel } from "@/utils/error";

export enum FileUploadException {
	DnsIncompatibleBucketName = "DnsIncompatibleBucketName",
	InvalidAWSAccountID = "InvalidAWSAccountID",
	InvalidCustomEndpoint = "InvalidCustomEndpoint",
	InvalidLocationCredentialsCacheSize = "InvalidLocationCredentialsCacheSize",
	InvalidS3Uri = "InvalidS3Uri",
	InvalidStorageBucket = "InvalidStorageBucket",
	InvalidStorageOperationPrefixInput = "InvalidStorageOperationPrefixInput",
	InvalidStorageOperationInput = "InvalidStorageOperationInput",
	InvalidStoragePathInput = "InvalidStoragePathInput",
	InvalidUploadSource = "InvalidUploadSource",
	LocationCredentialsStoreDestroyed = "LocationCredentialsStoreDestroyed",
	NoCredentials = "NoCredentials",
	NoIdentityId = "NoIdentityId",
	NoKey = "NoKey",
	NoBucket = "NoBucket",
	NoRegion = "NoRegion",
	ObjectIsTooLarge = "ObjectIsTooLarge",
	UrlExpirationMaxLimitExceed = "UrlExpirationMaxLimitExceed",
}

function createError<T extends FileUploadException>(
	title: string,
	message: string,
	errorCode: T,
	level: errorLevel,
) {
	return {
		title,
		message,
		errorCode,
		level,
	} as const;
}

export const STORAGE_ERROR = {
	[FileUploadException.DnsIncompatibleBucketName]: createError(
		"ファイルアップロードエラー",
		"指定されたバケット名はDNSと互換性がありません",
		FileUploadException.DnsIncompatibleBucketName,
		"error",
	),
	[FileUploadException.InvalidAWSAccountID]: createError(
		"ファイルアップロードエラー",
		"AWSアカウントIDが無効です",
		FileUploadException.InvalidAWSAccountID,
		"error",
	),
	[FileUploadException.InvalidCustomEndpoint]: createError(
		"ファイルアップロードエラー",
		"カスタムエンドポイントが無効です",
		FileUploadException.InvalidCustomEndpoint,
		"error",
	),
	[FileUploadException.InvalidLocationCredentialsCacheSize]: createError(
		"ファイルアップロードエラー",
		"ロケーション認証キャッシュサイズが無効です",
		FileUploadException.InvalidLocationCredentialsCacheSize,
		"error",
	),
	[FileUploadException.InvalidS3Uri]: createError(
		"ファイルアップロードエラー",
		"S3 URIが無効です",
		FileUploadException.InvalidS3Uri,
		"error",
	),
	[FileUploadException.InvalidStorageBucket]: createError(
		"ファイルアップロードエラー",
		"バケット名が無効です",
		FileUploadException.InvalidStorageBucket,
		"error",
	),
	[FileUploadException.InvalidStorageOperationPrefixInput]: createError(
		"ファイルアップロードエラー",
		"パスとプレフィックスを同時に指定することはできません",
		FileUploadException.InvalidStorageOperationPrefixInput,
		"error",
	),
	[FileUploadException.InvalidStorageOperationInput]: createError(
		"ファイルアップロードエラー",
		"パラメータにはパスまたはキーのどちらか片方を指定する必要があります。両方を同時に指定することはできません",
		FileUploadException.InvalidStorageOperationInput,
		"error",
	),
	[FileUploadException.InvalidStoragePathInput]: createError(
		"ファイルアップロードエラー",
		"パスが無効です",
		FileUploadException.InvalidStoragePathInput,
		"error",
	),
	[FileUploadException.InvalidUploadSource]: createError(
		"ファイルアップロードエラー",
		"アップロード元データには Blob、File、ArrayBuffer、またはstringのみ指定できます。",
		FileUploadException.InvalidUploadSource,
		"error",
	),
	[FileUploadException.LocationCredentialsStoreDestroyed]: createError(
		"ファイルアップロードエラー",
		"ロケーション認証ストアが破壊されました",
		FileUploadException.LocationCredentialsStoreDestroyed,
		"error",
	),
	[FileUploadException.NoCredentials]: createError(
		"ファイルアップロードエラー",
		"認証情報がありません",
		FileUploadException.NoCredentials,
		"error",
	),
	[FileUploadException.NoIdentityId]: createError(
		"ファイルアップロードエラー",
		"保護またはプライベートアクセスレベルのオブジェクトにアクセスするための認証情報が不足しています",
		FileUploadException.NoIdentityId,
		"error",
	),
	[FileUploadException.NoKey]: createError(
		"ファイルアップロードエラー",
		"API呼び出しで認証情報が不足しています",
		FileUploadException.NoKey,
		"error",
	),
	[FileUploadException.NoBucket]: createError(
		"ファイルアップロードエラー",
		"オブジェクトにアクセスする際のバケット名が不足しています",
		FileUploadException.NoBucket,
		"error",
	),
	[FileUploadException.NoRegion]: createError(
		"ファイルアップロードエラー",
		"オブジェクトにアクセスする際のリージョンが不足しています",
		FileUploadException.NoRegion,
		"error",
	),
	[FileUploadException.ObjectIsTooLarge]: createError(
		"ファイルアップロードエラー",
		"5TBを超えるオブジェクトはアップロードできません",
		FileUploadException.ObjectIsTooLarge,
		"error",
	),
	[FileUploadException.UrlExpirationMaxLimitExceed]: createError(
		"ファイルアップロードエラー",
		"URLの有効期限は最大7日間です",
		FileUploadException.UrlExpirationMaxLimitExceed,
		"error",
	),
};

export const storageErrorDefinition = Object.fromEntries(
	Object.entries(STORAGE_ERROR).map(([, value]) => [value.errorCode, value]),
) as Record<FileUploadException, ErrorDefinition<FileUploadException>>;
