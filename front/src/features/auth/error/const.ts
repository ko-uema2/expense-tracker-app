import type { AuthException } from "@/features/auth/error/type";
import type { ErrorDefinition, errorLevel } from "@/utils/error";

export enum SignInException {
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
}

export enum SignUpException {
	AliasExistsException = "AliasExistsException",
	CodeDeliveryFailureException = "CodeDeliveryFailureException",
	InvalidParameterException = "InvalidParameterException",
	LimitExceededException = "LimitExceededException",
	UsernameExistsException = "UsernameExistsException",
	SignUpNetworkException = "SignUpNetworkException",
}

function createError<T extends AuthException>(
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

export const SIGNIN_ERROR = {
	// Error: The confirmation code could not be sent.
	[SignInException.CodeDeliveryFailureException]: createError(
		"認証エラー",
		"確認コードの送信に失敗しました。しばらく時間を置いてから再度お試しください。",
		SignInException.CodeDeliveryFailureException,
		"error",
	),
	// Error: An internal error occurred during authentication.
	[SignInException.InternalErrorException]: createError(
		"Internal Error",
		"認証処理で内部エラーが発生しました。",
		SignInException.InternalErrorException,
		"fatal",
	),
	// Error: A network error occurred during authentication. Client side error.
	[SignInException.SignInNetworkException]: createError(
		"ネットワークエラー",
		"ログイン処理でネットワークエラーが発生しました。利用端末のネットワーク環境を確認してください。解決しない場合は、開発者にお問い合わせください。",
		SignInException.SignInNetworkException,
		"fatal",
	),
	// Error: The email address or phone number is already in use.
	[SignInException.AliasExistsException]: createError(
		"サインアップエラー",
		"入力したメールアドレスまたは電話番号は別のアカウントで利用されています。他のメールアドレスまたは電話番号をお試しください。",
		SignInException.AliasExistsException,
		"error",
	),
	// Error: The confirmation code is incorrect.
	[SignInException.CodeMismatchException]: createError(
		"認証エラー",
		"確認コードが間違っています。認証メールに記載されたコードを再度確認してください。",
		SignInException.CodeMismatchException,
		"error",
	),
	// Error: The confirmation code has expired.
	[SignInException.ExpiredCodeException]: createError(
		"認証エラー",
		"確認コードの有効期限が切れています。再度確認コードを送信してください。",
		SignInException.ExpiredCodeException,
		"error",
	),
	// Error: The parameter is invalid.
	[SignInException.InvalidParameterException]: createError(
		"認証エラー",
		"入力された情報が無効です。入力内容を確認してください。",
		SignInException.InvalidParameterException,
		"error",
	),
	// Error: The password is invalid.
	[SignInException.InvalidPasswordException]: createError(
		"サインアップエラー",
		"入力されたパスワードはセキュリティポリシーを満たしていません。8文字以上で、少なくとも1つの大文字、小文字、数字、および特殊文字を含むパスワードを設定してください。",
		SignInException.InvalidPasswordException,
		"error",
	),
	// Error: The limit has been exceeded.
	[SignInException.LimitExceededException]: createError(
		"認証エラー",
		"リクエストの制限を超えました。しばらく時間を置いてから再度お試しください。",
		SignInException.LimitExceededException,
		"error",
	),
	// Error: The email address or password is incorrect.
	[SignInException.NotAuthorizedException]: createError(
		"ログインエラー",
		"メールアドレスまたはパスワードが間違っています",
		SignInException.NotAuthorizedException,
		"error",
	),
	// Error: The request is unauthorized.
	[SignInException.UnauthorizedException]: createError(
		"認証エラー",
		"リクエストが認証されていません。ログインから再度お試しください。",
		SignInException.UnauthorizedException,
		"error",
	),
	// Error: The user is not confirmed.
	[SignInException.UserNotConfirmedException]: createError(
		"認証エラー",
		"ユーザーが認証されていません。メールアドレスに送信された確認コードを入力してください。",
		SignInException.UserNotConfirmedException,
		"error",
	),
	// Error: The user is not found.
	[SignInException.UserNotFoundException]: createError(
		"ログインエラー",
		"ユーザーが見つかりません。メールアドレスをもう一度確認してください。",
		SignInException.UserNotFoundException,
		"error",
	),
	// unchecked exception
} as const;

export const SIGNUP_ERROR = {
	[SignUpException.AliasExistsException]: createError(
		"サインアップエラー",
		"入力したメールアドレスまたは電話番号は別のアカウントで利用されています。他のメールアドレスまたは電話番号をお試しください。",
		SignUpException.AliasExistsException,
		"error",
	),
	[SignUpException.CodeDeliveryFailureException]: createError(
		"認証エラー",
		"確認コードの送信に失敗しました。しばらく時間を置いてから再度お試しください。",
		SignUpException.CodeDeliveryFailureException,
		"error",
	),
	[SignUpException.InvalidParameterException]: createError(
		"認証エラー",
		"入力された情報が無効です。入力内容を確認してください。",
		SignUpException.InvalidParameterException,
		"error",
	),
	[SignUpException.LimitExceededException]: createError(
		"認証エラー",
		"リクエストの制限を超えました。しばらく時間を置いてから再度お試しください。",
		SignUpException.LimitExceededException,
		"error",
	),
	// Error: The email address is already registered.
	[SignUpException.UsernameExistsException]: createError(
		"サインアップエラー",
		"メールアドレスがすでに登録されています。別のメールアドレスをお試しください。",
		SignUpException.UsernameExistsException,
		"error",
	),
	[SignUpException.SignUpNetworkException]: createError(
		"ネットワークエラー",
		"サインアップ処理でネットワークエラーが発生しました。利用端末のネットワーク環境を確認してください。解決しない場合は、開発者にお問い合わせください。",
		SignUpException.SignUpNetworkException,
		"fatal",
	),
} as const;

export const AUTH_ERROR = {
	...SIGNIN_ERROR,
	...SIGNUP_ERROR,
} as const;

/**
 * Error definition for each error code.
 * @type {Record<AuthException, ErrorDefinition<AuthException>>}
 * @constant
 * @alias authErrorDefinition
 * @memberof module:features/auth/error
 * @see {@link module:features/auth/error/const|AUTH_ERROR}
 * @see {@link module:features/auth/error|AuthError}
 * @see {@link module:utils/error|ErrorDefinition}
 * @example
 * console.log(authErrorDefinition[SignInException.UserNotFoundException]);
 * // Output: {
 * //     title: "ログインエラー",
 * //     message: "ユーザーが見つかりません。メールアドレスをもう一度確認してください。",
 * //     errorCode: "UserNotFoundException",
 * //     level: "error",
 * // }
 */
export const authErrorDefinition = Object.fromEntries(
	Object.entries(AUTH_ERROR).map(([, value]) => [value.errorCode, value]),
) as Record<AuthException, ErrorDefinition<AuthException>>;
