import type { ErrorDefinition, errorLevel } from "@/utils/error";

export enum AuthErrorNames {
	// Cognito Error Codes
	AliasExistsException = "AliasExistsException",
	CodeDeliveryFailureException = "CodeDeliveryFailureException",
	CodeMismatchException = "CodeMismatchException",
	ExpiredCodeException = "ExpiredCodeException",
	InternalErrorException = "InternalErrorException",
	InvalidParameterException = "InvalidParameterException",
	InvalidPasswordException = "InvalidPasswordException",
	LimitExceededException = "LimitExceededException",
	NotAuthorizedException = "NotAuthorizedException",
	UnauthorizedException = "UnauthorizedException",
	UsernameExistsException = "UsernameExistsException",
	UserNotConfirmedException = "UserNotConfirmedException",
	UserNotFoundException = "UserNotFoundException",
	// Client Error Codes
	SignInNetworkException = "SignInNetworkException",
	SignUpNetworkException = "SignUpNetworkException",
}

function createError<T extends AuthErrorNames>(
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

export const AUTH_ERROR = {
	// Error: The confirmation code could not be sent.
	[AuthErrorNames.CodeDeliveryFailureException]: createError(
		"認証エラー",
		"確認コードの送信に失敗しました。しばらく時間を置いてから再度お試しください。",
		AuthErrorNames.CodeDeliveryFailureException,
		"error",
	),
	// Error: An internal error occurred during authentication.
	[AuthErrorNames.InternalErrorException]: createError(
		"Internal Error",
		"認証処理で内部エラーが発生しました。",
		AuthErrorNames.InternalErrorException,
		"fatal",
	),
	// Error: A network error occurred during authentication. Client side error.
	[AuthErrorNames.SignInNetworkException]: createError(
		"ネットワークエラー",
		"ログイン処理でネットワークエラーが発生しました。利用端末のネットワーク環境を確認してください。解決しない場合は、開発者にお問い合わせください。",
		AuthErrorNames.SignInNetworkException,
		"fatal",
	),
	// Error: A network error occurred during authentication. Client side error.
	[AuthErrorNames.SignUpNetworkException]: createError(
		"ネットワークエラー",
		"サインアップ処理でネットワークエラーが発生しました。利用端末のネットワーク環境を確認してください。解決しない場合は、開発者にお問い合わせください。",
		AuthErrorNames.SignUpNetworkException,
		"fatal",
	),
	// Error: The email address or phone number is already in use.
	[AuthErrorNames.AliasExistsException]: createError(
		"サインアップエラー",
		"入力したメールアドレスまたは電話番号は別のアカウントで利用されています。他のメールアドレスまたは電話番号をお試しください。",
		AuthErrorNames.AliasExistsException,
		"error",
	),
	// Error: The confirmation code is incorrect.
	[AuthErrorNames.CodeMismatchException]: createError(
		"認証エラー",
		"確認コードが間違っています。認証メールに記載されたコードを再度確認してください。",
		AuthErrorNames.CodeMismatchException,
		"error",
	),
	// Error: The confirmation code has expired.
	[AuthErrorNames.ExpiredCodeException]: createError(
		"認証エラー",
		"確認コードの有効期限が切れています。再度確認コードを送信してください。",
		AuthErrorNames.ExpiredCodeException,
		"error",
	),
	// Error: The parameter is invalid.
	[AuthErrorNames.InvalidParameterException]: createError(
		"認証エラー",
		"入力された情報が無効です。入力内容を確認してください。",
		AuthErrorNames.InvalidParameterException,
		"error",
	),
	// Error: The password is invalid.
	[AuthErrorNames.InvalidPasswordException]: createError(
		"サインアップエラー",
		"入力されたパスワードはセキュリティポリシーを満たしていません。8文字以上で、少なくとも1つの大文字、小文字、数字、および特殊文字を含むパスワードを設定してください。",
		AuthErrorNames.InvalidPasswordException,
		"error",
	),
	// Error: The limit has been exceeded.
	[AuthErrorNames.LimitExceededException]: createError(
		"認証エラー",
		"リクエストの制限を超えました。しばらく時間を置いてから再度お試しください。",
		AuthErrorNames.LimitExceededException,
		"error",
	),
	// Error: The email address or password is incorrect.
	[AuthErrorNames.NotAuthorizedException]: createError(
		"ログインエラー",
		"メールアドレスまたはパスワードが間違っています",
		AuthErrorNames.NotAuthorizedException,
		"error",
	),
	// Error: The request is unauthorized.
	[AuthErrorNames.UnauthorizedException]: createError(
		"認証エラー",
		"リクエストが認証されていません。ログインから再度お試しください。",
		AuthErrorNames.UnauthorizedException,
		"error",
	),
	// Error: The email address is already registered.
	[AuthErrorNames.UsernameExistsException]: createError(
		"サインアップエラー",
		"メールアドレスがすでに登録されています。別のメールアドレスをお試しください。",
		AuthErrorNames.UsernameExistsException,
		"error",
	),
	// Error: The user is not confirmed.
	[AuthErrorNames.UserNotConfirmedException]: createError(
		"認証エラー",
		"ユーザーが認証されていません。メールアドレスに送信された確認コードを入力してください。",
		AuthErrorNames.UserNotConfirmedException,
		"error",
	),
	// Error: The user is not found.
	[AuthErrorNames.UserNotFoundException]: createError(
		"ログインエラー",
		"ユーザーが見つかりません。メールアドレスをもう一度確認してください。",
		AuthErrorNames.UserNotFoundException,
		"error",
	),
	// unchecked exception
} as const;

/**
 * Error definition for each error code.
 * @type {Record<AuthErrorNames, ErrorDefinition<AuthErrorNames>>}
 * @constant
 * @alias authErrorDefinition
 * @memberof module:features/auth/error
 * @see {@link module:features/auth/error/const|AUTH_ERROR}
 * @see {@link module:features/auth/error|AuthError}
 * @see {@link module:utils/error|ErrorDefinition}
 * @example
 * console.log(authErrorDefinition[AuthErrorNames.UserNotFoundException]);
 * // Output: {
 * //     title: "ログインエラー",
 * //     message: "ユーザーが見つかりません。メールアドレスをもう一度確認してください。",
 * //     errorCode: "UserNotFoundException",
 * //     level: "error",
 * // }
 */
export const authErrorDefinition = Object.fromEntries(
	Object.entries(AUTH_ERROR).map(([, value]) => [value.errorCode, value]),
) as Record<AuthErrorNames, ErrorDefinition<AuthErrorNames>>;
