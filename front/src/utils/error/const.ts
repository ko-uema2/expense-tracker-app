import type { ErrorDefinition } from "@/utils/error/type";

export enum GeneralException {
	NotAuthorizedException = 'NotAuthorizedException',
}

export const GENERAL_ERROR = {
	[GeneralException.NotAuthorizedException]: {
		title: "認証エラー",
		message: "認証に失敗しました。再度ログインしてください。",
		errorCode: GeneralException.NotAuthorizedException,
		level: "error",
	},
} as const;

export const generalErrorDefinition = Object.fromEntries(
	Object.entries(GENERAL_ERROR).map(([, value]) => [value.errorCode, value]),
) as Record<GeneralException, ErrorDefinition<GeneralException>>;
