import { ActionButton } from "@/components/button";
import { Email, Password } from "@/components/form";
import {
	DollarIcon,
	GraphIcon,
	UploadIcon,
	WalletIcon,
} from "@/components/icon";
import { Alert } from "@/components/notification";
import { Button, Form, Input } from "@/components/ui";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import type { SignInInfo } from "@/features/auth/types";
import { NoError } from "@/utils/error";
import { signInInfoSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useEffect, useState } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GitHubSignInButton } from "./GitHubSignInButton";
import { GoogleSignInButton } from "./GoogleSignInButton";

// --- Branding（左側） ---
const SignInBranding: FC = () => (
	<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
		<div className="absolute inset-0 bg-black bg-opacity-10" />
		<div className="relative z-10 flex flex-col justify-center px-12 text-white">
			<div className="mb-8">
				<div className="flex items-center mb-6">
					<div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
						<DollarIcon className="text-white" size={28} />
					</div>
					<h1 className="text-3xl font-bold">支出管理</h1>
				</div>
				<h2 className="text-4xl font-bold mb-4">家計を見える化して</h2>
				<h2 className="text-4xl font-bold mb-6">賢く節約しよう</h2>
				<p className="text-xl text-blue-100 mb-8">
					シンプルで直感的な支出管理で、あなたの財務目標を達成しましょう
				</p>
			</div>
			<div className="space-y-4">
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
						<GraphIcon size={16} />
					</div>
					<span className="text-lg">詳細な支出分析とレポート</span>
				</div>
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
						<UploadIcon size={16} />
					</div>
					<span className="text-lg">CSVファイルで簡単データインポート</span>
				</div>
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
						<WalletIcon className="" size={16} />
					</div>
					<span className="text-lg">予算設定と支出アラート</span>
				</div>
			</div>
		</div>
		<div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full" />
		<div className="absolute bottom-20 right-32 w-20 h-20 bg-white bg-opacity-10 rounded-full" />
		<div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full" />
	</div>
);

// --- Social Buttons ---
const SignInSocialButtons: FC<{ isLoading: boolean }> = ({ isLoading }) => (
	<div className="space-y-3 mb-6">
		<GoogleSignInButton disabled={isLoading} />
		<GitHubSignInButton disabled={isLoading} />
	</div>
);

// --- Demo Info ---
const SignInDemoInfo: FC = () => (
	<div className="mt-6 p-4 bg-blue-50 rounded-lg">
		<h4 className="text-sm font-medium text-blue-800 mb-2">
			デモ用エラーテスト
		</h4>
		<div className="text-xs text-blue-700 space-y-1">
			<p>• blocked@example.com - アカウントロック</p>
			<p>• unverified@example.com - メール未認証</p>
			<p>• notfound@example.com - ユーザー未登録</p>
			<p>• パスワード: wrongpassword - 認証失敗</p>
		</div>
	</div>
);

// --- Form Fields ---
const SignInFormFields: FC<{
	form: ReturnType<typeof useForm<SignInInfo>>;
	isLoading: boolean;
}> = ({ form, isLoading }) => (
	<>
		<Email form={form} disabled={isLoading} />
		<Password form={form} disabled={isLoading} />
		<div className="flex items-center justify-between">
			<label className="flex items-center">
				<input
					type="checkbox"
					className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					disabled={isLoading}
				/>
				<span className="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
			</label>
		</div>
	</>
);

// --- Form Panel（右側） ---
const SignInFormPanel: FC = () => {
	const nav = useNavigate();
	const { isSuccessful, isLoading, error, signIn } = useSignIn();
	const [errContent, setErrContent] = useState<
		| {
				title: string;
				message: string;
		  }
		| undefined
	>(undefined);
	const form = useForm<SignInInfo>({
		resolver: zodResolver(signInInfoSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (isSuccessful) {
			nav("/app");
			return;
		}
		if (error instanceof NoError) return;
		setErrContent({
			title: error.title,
			message: error.message,
		});
	}, [isSuccessful, error, nav]);

	const handleSignIn = async (values: SignInInfo) => {
		await signIn({
			email: values.email,
			password: values.password,
		});
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
					おかえりなさい
				</h2>
				<p className="text-gray-600">
					アカウントにサインインして支出管理を続けましょう
				</p>
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
			<SignInSocialButtons isLoading={isLoading} />
			<div className="relative mb-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-200" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-4 bg-white text-gray-500">または</span>
				</div>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
					<SignInFormFields form={form} isLoading={isLoading} />
					<ActionButton
						type="submit"
						label="サインイン"
						loadingLabel="サインイン中..."
						isLoading={isLoading}
						className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
					/>
				</form>
			</Form>
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-600">
					アカウントをお持ちでない方は{" "}
					<Button
						variant="outline"
						className="text-blue-600 hover:text-blue-500 font-medium"
						onClick={() => nav("/auth/signup")}
					>
						新規登録
					</Button>
				</p>
			</div>
		</div>
	);
};

// --- メイン ---
export const SignIn: FC = memo(() => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="flex min-h-screen">
				<SignInBranding />
				<div className="flex-1 flex items-center justify-center px-6 py-12">
					<div className="w-full max-w-md">
						<SignInFormPanel />
						<SignInDemoInfo />
					</div>
				</div>
			</div>
		</div>
	);
});
