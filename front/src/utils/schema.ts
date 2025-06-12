import { z } from "zod";

export const CONFIRMATION_CODE_LENGTH = 6;

const userInfoSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Must be 8 or more characters long" })
		.refine(
			(password) =>
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/.test(
					password,
				),
			{
				message:
					"パスワードは英大文字・英小文字・数字・記号をそれぞれ1文字以上含めてください",
			},
		),
});

export const signInInfoSchema = userInfoSchema;

export const confirmationInfoSchema = userInfoSchema.extend({
	confirmationCode: z.string().length(CONFIRMATION_CODE_LENGTH, {
		message: `${CONFIRMATION_CODE_LENGTH}桁の確認コードを入力してください`,
	}),
});

export const signUpInfoSchema = userInfoSchema
	.extend({
		confirmPassword: z
			.string()
			.min(1, { message: "確認用パスワードを入力してください" }),
		agreedToTerms: z.literal(true, {
			errorMap: () => ({ message: "利用規約への同意が必要です" }),
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "パスワードが一致しません",
		path: ["confirmPassword"],
	});
