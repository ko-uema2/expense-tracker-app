import { ActionButton } from "@/components/button";
import { Email, Password } from "@/components/form";
import { CheckIcon, DollarIcon } from "@/components/icon";
import { Alert } from "@/components/notification";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components/ui";
import { useConfirmAccount } from "@/features/auth/hooks/useConfirmAccount";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { useSignUp } from "@/features/auth/hooks/useSignUp";
import type { ConfirmationInfo, SignUpInfo } from "@/features/auth/types";
import { NoError } from "@/utils/error";
import {
	CONFIRMATION_CODE_LENGTH,
	confirmationInfoSchema,
	signUpInfoSchema,
} from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useEffect, useState } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GitHubSignInButton } from "./GitHubSignInButton";
import { GoogleSignInButton } from "./GoogleSignInButton";

const SignUpBranding: FC = () => (
	<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 relative overflow-hidden">
		<div className="absolute inset-0 bg-black bg-opacity-10" />
		<div className="relative z-10 flex flex-col justify-center px-12 text-white">
			<div className="mb-8">
				<div className="flex items-center mb-6">
					<div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
						<DollarIcon className="text-white" size={28} />
					</div>
					<h1 className="text-3xl font-bold">支出管理</h1>
				</div>
				<h2 className="text-4xl font-bold mb-4">今日から始める</h2>
				<h2 className="text-4xl font-bold mb-6">スマート家計管理</h2>
				<p className="text-xl text-purple-100 mb-8">
					無料でアカウントを作成して、あなたの支出管理を始めましょう
				</p>
			</div>
			<div className="space-y-4">
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
						<CheckIcon size={16} />
					</div>
					<span className="text-lg">完全無料で利用可能</span>
				</div>
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
						<CheckIcon size={16} />
					</div>
					<span className="text-lg">データの安全性を保証</span>
				</div>
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
						<CheckIcon size={16} />
					</div>
					<span className="text-lg">いつでもアカウント削除可能</span>
				</div>
			</div>
		</div>
		<div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full" />
		<div className="absolute bottom-20 right-32 w-20 h-20 bg-white bg-opacity-10 rounded-full" />
		<div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full" />
	</div>
);

const SignUpSocialButtons: FC<{ isLoading: boolean }> = ({ isLoading }) => (
	<div className="space-y-3 mb-6">
		<GoogleSignInButton disabled={isLoading} />
		<GitHubSignInButton disabled={isLoading} />
	</div>
);

const SignUpDemoInfo: FC = () => (
	<div className="mt-6 p-4 bg-purple-50 rounded-lg">
		<h4 className="text-sm font-medium text-purple-800 mb-2">
			デモ用エラーテスト
		</h4>
		<div className="text-xs text-purple-700 space-y-1">
			<p>• existing@example.com - 既存メールアドレス</p>
			<p>• invalid@invalid.com - 無効ドメイン</p>
			<p>• admin を含む名前 - 無効ユーザー名</p>
		</div>
	</div>
);

const SignUpFormFields: FC<{
	form: ReturnType<typeof useForm<SignUpInfo>>;
	isLoading: boolean;
}> = ({ form, isLoading }) => (
	<>
		<Email form={form} disabled={isLoading} />
		<Password form={form} disabled={isLoading} />
		<FormField
			control={form.control}
			name="confirmPassword"
			render={({ field }) => (
				<FormItem>
					<FormLabel>パスワード確認</FormLabel>
					<FormControl>
						<input
							{...field}
							id="confirmPassword"
							type="password"
							placeholder="パスワードを再入力"
							className="h-12 w-full border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
							disabled={isLoading}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
		<FormField
			control={form.control}
			name="agreedToTerms"
			render={({ field }) => (
				<FormItem>
					<div className="flex items-start space-x-2">
						<input
							id="terms"
							type="checkbox"
							checked={field.value}
							onChange={field.onChange}
							className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							required
							disabled={isLoading}
						/>
						<label htmlFor="terms" className="text-sm text-gray-600">
							<a href="/terms" className="text-blue-600 hover:text-blue-500">
								利用規約
							</a>
							および
							<a href="/privacy" className="text-blue-600 hover:text-blue-500">
								プライバシーポリシー
							</a>
							に同意します
						</label>
					</div>
					<FormMessage />
				</FormItem>
			)}
		/>
	</>
);

const SignUpVerificationPanel: FC<{
	onBack: () => void;
	form: ReturnType<typeof useForm<ConfirmationInfo>>;
}> = ({ onBack, form }) => {
	const nav = useNavigate();
	const {
		isSuccessful: isConfirmSuccessful,
		isLoading: isConfirmLoading,
		error: confirmError,
		confirmAccount,
	} = useConfirmAccount();
	const {
		isSuccessful: isSignInSuccessful,
		isLoading: isSignInLoading,
		error: signInError,
		signIn,
	} = useSignIn();
	const [errContent, setErrContent] = useState<
		| {
				title: string;
				message: string;
		  }
		| undefined
	>(undefined);

	useEffect(() => {
		if (isConfirmSuccessful) {
			signIn({
				email: form.getValues("email"),
				password: form.getValues("password"),
			});
			return;
		}

		if (confirmError instanceof NoError) return;

		setErrContent({
			title: confirmError.title,
			message: confirmError.message,
		});
	}, [isConfirmSuccessful, signIn, confirmError, form]);

	useEffect(() => {
		if (isSignInSuccessful) {
			nav("/app");
			return;
		}

		if (signInError instanceof NoError) return;

		setErrContent({
			title: signInError.title,
			message: signInError.message,
		});
	}, [isSignInSuccessful, signInError, nav]);

	const handleVerification = async (values: ConfirmationInfo) => {
		await confirmAccount({
			email: values.email,
			confirmationCode: values.confirmationCode,
		});
	};

	const handleResend = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	console.log(confirmError);

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
			<div className="text-center mb-8">
				<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					{/* アイコン等 */}
				</div>
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					確認コードを入力
				</h2>
				{/* Error message */}
				{errContent && (
					<div className="mb-6">
						<Alert
							message={errContent.message}
							onClick={() => setErrContent(undefined)}
						/>
					</div>
				)}
				<p className="text-gray-600 mb-2">
					<span className="font-medium">{form.watch("email")}</span>{" "}
					に確認コードを送信しました
				</p>
				<p className="text-sm text-gray-500">
					メールが届かない場合は、迷惑メールフォルダもご確認ください
				</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleVerification)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="confirmationCode"
						render={({ field }) => (
							<FormItem>
								<FormLabel>確認コード</FormLabel>
								<FormControl>
									<Input
										{...field}
										id="confirmationCode"
										type="text"
										inputMode="numeric"
										pattern="[0-9]*"
										value={field.value
											.replace(/\D/g, "")
											.slice(0, CONFIRMATION_CODE_LENGTH)}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											field.onChange(
												e.target.value
													.replace(/\D/g, "")
													.slice(0, CONFIRMATION_CODE_LENGTH),
											)
										}
										placeholder={`${CONFIRMATION_CODE_LENGTH}桁のコードを入力`}
										className="h-12 w-full text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md px-3"
										maxLength={CONFIRMATION_CODE_LENGTH}
										required
										disabled={isConfirmLoading || isSignInLoading}
									/>
								</FormControl>
								<FormMessage />
								<p className="text-xs text-gray-500 mt-2">
									{CONFIRMATION_CODE_LENGTH}桁の数字を入力してください
								</p>
							</FormItem>
						)}
					/>
					<ActionButton
						type="submit"
						label="確認コードを送信"
						loadingLabel="確認中..."
						isLoading={isConfirmLoading || isSignInLoading}
						className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
						disabled={
							form.watch("confirmationCode").length !==
								CONFIRMATION_CODE_LENGTH ||
							isConfirmLoading ||
							isSignInLoading
						}
					/>
				</form>
			</Form>
			<div className="mt-6 text-center space-y-3">
				<Button
					type="button"
					onClick={handleResend}
					variant="ghost"
					className="bg-transparent text-sm text-blue-600 hover:text-blue-500 font-medium"
					disabled={isConfirmLoading || isSignInLoading}
				>
					確認コードを再送信
				</Button>
				<div>
					<Button
						type="button"
						onClick={onBack}
						variant="outline"
						className="bg-transparent text-sm text-gray-600 hover:text-gray-500"
						disabled={isConfirmLoading || isSignInLoading}
					>
						← メールアドレスを変更する
					</Button>
				</div>
			</div>
			<div className="mt-6 p-4 bg-blue-50 rounded-lg">
				<h4 className="text-sm font-medium text-blue-800 mb-2">
					デモ用確認コード
				</h4>
				<div className="text-xs text-blue-700 space-y-1">
					<p>• 123456 - 正常な確認コード</p>
					<p>• 000000 - 無効なコード</p>
					<p>• 111111 - 期限切れコード</p>
				</div>
			</div>
		</div>
	);
};

const SignUpInfoPanel: FC<{
	form: ReturnType<typeof useForm<SignUpInfo>>;
	setStep: (step: "signup" | "verification") => void;
}> = ({ setStep, form }) => {
	const { isSuccessful, isLoading, error, signUp } = useSignUp();
	const [errContent, setErrContent] = useState<
		| {
				title: string;
				message: string;
		  }
		| undefined
	>(undefined);

	useEffect(() => {
		if (isSuccessful) {
			setStep("verification");
			return;
		}
		if (error instanceof NoError) return;
		setErrContent({
			title: error.title,
			message: error.message,
		});
	}, [isSuccessful, error, setStep]);

	const handleSignUp = async (values: SignUpInfo) => {
		console.log("SignUpFormPanel: handleSignUp", values);
		await signUp(values);
	};

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
			{/* Mobile logo */}
			<div className="lg:hidden flex items-center justify-center mb-8">
				<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
					<DollarIcon className="text-white" size={24} />
				</div>
				<span className="text-2xl font-bold text-gray-900">支出管理</span>
			</div>
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 mb-2">
					アカウント作成
				</h2>
				<p className="text-gray-600">無料で支出管理を始めましょう</p>
			</div>
			{/* Error message */}
			{errContent && (
				<div className="mb-6">
					<Alert
						message={errContent.message}
						onClick={() => setErrContent(undefined)}
					/>
				</div>
			)}
			<SignUpSocialButtons isLoading={isLoading} />
			<div className="relative mb-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-200" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-4 bg-white text-gray-500">または</span>
				</div>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
					<SignUpFormFields form={form} isLoading={isLoading} />
					<ActionButton
						type="submit"
						label="アカウントを作成"
						loadingLabel="アカウント作成中..."
						isLoading={isLoading}
						className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
					/>
				</form>
			</Form>
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-600">
					すでにアカウントをお持ちの方は{" "}
					<a
						href="/auth/signin"
						className="text-blue-600 hover:text-blue-500 font-medium"
					>
						サインイン
					</a>
				</p>
			</div>
		</div>
	);
};

const SignUpFormPanel: FC = () => {
	const [step, setStep] = useState<"signup" | "verification">("signup");
	const signUpForm = useForm<SignUpInfo>({
		resolver: zodResolver(signUpInfoSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			agreedToTerms: true,
		},
		mode: "onChange",
	});
	const confirmForm = useForm<ConfirmationInfo>({
		resolver: zodResolver(confirmationInfoSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmationCode: "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (step === "verification") {
			confirmForm.setValue("email", signUpForm.watch("email"));
			confirmForm.setValue("password", signUpForm.watch("password"));
		}
	}, [step, signUpForm, confirmForm]);

	if (step === "verification") {
		return (
			<SignUpVerificationPanel
				onBack={() => setStep("signup")}
				form={confirmForm}
			/>
		);
	}
	return <SignUpInfoPanel setStep={setStep} form={signUpForm} />;
};

export const SignUp: FC = memo(() => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="flex min-h-screen">
				<SignUpBranding />
				<div className="flex-1 flex items-center justify-center px-6 py-12">
					<div className="w-full max-w-md">
						<SignUpFormPanel />
						<SignUpDemoInfo />
					</div>
				</div>
			</div>
		</div>
	);
});
