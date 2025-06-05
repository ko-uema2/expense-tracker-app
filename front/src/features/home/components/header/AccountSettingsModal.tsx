"use client";

import { BaseModal } from "@/components/notification/BaseModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

interface AccountSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type FormDataType = typeof initialFormData;
type ShowPasswordsType = typeof initialShowPasswords;

type ProfileTabProps = {
	formData: FormDataType;
	setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
	isLoading: boolean;
	handleSave: (section: string) => void;
};
const ProfileTab = ({
	formData,
	setFormData,
	isLoading,
	handleSave,
}: ProfileTabProps) => {
	return (
		<div className="space-y-4">
			<div>
				<Label htmlFor="name">お名前</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="mt-1"
				/>
			</div>
			<div>
				<Label htmlFor="email">メールアドレス</Label>
				<Input
					id="email"
					type="email"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					className="mt-1"
				/>
				<p className="text-xs text-gray-500 mt-1">
					メールアドレスを変更すると確認メールが送信されます
				</p>
			</div>
			<Button onClick={() => handleSave("プロフィール")} disabled={isLoading}>
				{isLoading ? "保存中..." : "変更を保存"}
			</Button>
		</div>
	);
};

type SecurityTabProps = {
	formData: FormDataType;
	setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
	showPasswords: ShowPasswordsType;
	setShowPasswords: React.Dispatch<React.SetStateAction<ShowPasswordsType>>;
	isLoading: boolean;
	handleSave: (section: string) => void;
};
const SecurityTab = ({
	formData,
	setFormData,
	showPasswords,
	setShowPasswords,
	isLoading,
	handleSave,
}: SecurityTabProps) => {
	return (
		<div className="space-y-4">
			<div>
				<Label htmlFor="currentPassword">現在のパスワード</Label>
				<div className="relative mt-1">
					<Input
						id="currentPassword"
						type={showPasswords.current ? "text" : "password"}
						value={formData.currentPassword}
						onChange={(e) =>
							setFormData({
								...formData,
								currentPassword: e.target.value,
							})
						}
						className="pr-10"
					/>
					<button
						type="button"
						className="absolute inset-y-0 right-0 flex items-center pr-3"
						onClick={() =>
							setShowPasswords({
								...showPasswords,
								current: !showPasswords.current,
							})
						}
					>
						{showPasswords.current ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
								<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
								<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
								<line x1="2" x2="22" y1="2" y2="22" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						)}
					</button>
				</div>
			</div>

			<div>
				<Label htmlFor="newPassword">新しいパスワード</Label>
				<div className="relative mt-1">
					<Input
						id="newPassword"
						type={showPasswords.new ? "text" : "password"}
						value={formData.newPassword}
						onChange={(e) =>
							setFormData({
								...formData,
								newPassword: e.target.value,
							})
						}
						className="pr-10"
					/>
					<button
						type="button"
						className="absolute inset-y-0 right-0 flex items-center pr-3"
						onClick={() =>
							setShowPasswords({
								...showPasswords,
								new: !showPasswords.new,
							})
						}
					>
						{showPasswords.new ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
								<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
								<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
								<line x1="2" x2="22" y1="2" y2="22" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						)}
					</button>
				</div>
			</div>

			<div>
				<Label htmlFor="confirmPassword">パスワード確認</Label>
				<div className="relative mt-1">
					<Input
						id="confirmPassword"
						type={showPasswords.confirm ? "text" : "password"}
						value={formData.confirmPassword}
						onChange={(e) =>
							setFormData({
								...formData,
								confirmPassword: e.target.value,
							})
						}
						className="pr-10"
					/>
					<button
						type="button"
						className="absolute inset-y-0 right-0 flex items-center pr-3"
						onClick={() =>
							setShowPasswords({
								...showPasswords,
								confirm: !showPasswords.confirm,
							})
						}
					>
						{showPasswords.confirm ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
								<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
								<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
								<line x1="2" x2="22" y1="2" y2="22" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						)}
					</button>
				</div>
			</div>

			<Button onClick={() => handleSave("パスワード")} disabled={isLoading}>
				{isLoading ? "更新中..." : "パスワードを更新"}
			</Button>
		</div>
	);
};

type DataTabProps = {
	handleExportData: () => void;
	handleDeleteAccount: () => void;
	isLoading: boolean;
};
const DataTab = ({
	handleExportData,
	handleDeleteAccount,
	isLoading,
}: DataTabProps) => {
	return (
		<div className="space-y-6">
			<div className="border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-medium">データエクスポート</h3>
						<p className="text-sm text-gray-500">
							すべての支出データをCSV形式でダウンロード
						</p>
					</div>
					<Button onClick={handleExportData} variant="outline">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-2"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" x2="12" y1="15" y2="3" />
						</svg>
						エクスポート
					</Button>
				</div>
			</div>

			<div className="border border-red-200 rounded-lg p-4 bg-red-50">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-medium text-red-800">アカウント削除</h3>
						<p className="text-sm text-red-600">
							アカウントとすべてのデータが完全に削除されます。この操作は取り消せません。
						</p>
					</div>
					<Button onClick={handleDeleteAccount} variant="destructive">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-2"
						>
							<path d="M3 6h18" />
							<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
							<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
							<line x1="10" x2="10" y1="11" y2="17" />
							<line x1="14" x2="14" y1="11" y2="17" />
						</svg>
						削除
					</Button>
				</div>
			</div>
		</div>
	);
};

const initialFormData = {
	name: "山田太郎",
	email: "user@example.com",
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};
const initialShowPasswords = { current: false, new: false, confirm: false };

export const AccountSettingsModal = ({
	isOpen,
	onClose,
}: AccountSettingsModalProps) => {
	const [formData, setFormData] = useState(initialFormData);
	const [showPasswords, setShowPasswords] = useState(initialShowPasswords);
	const [isLoading, setIsLoading] = useState(false);

	const handleSave = async (section: string) => {
		setIsLoading(true);

		// シミュレート API 呼び出し
		await new Promise((resolve) => setTimeout(resolve, 1000));

		toast.success(`${section}を更新しました`);
		setIsLoading(false);
	};

	const handleExportData = () => {
		toast.loading("データをエクスポート中...", { id: "export" });

		setTimeout(() => {
			toast.dismiss("export");
			toast.success("データエクスポートが完了しました", {
				description: "ダウンロードが開始されます",
			});
		}, 2000);
	};

	const handleDeleteAccount = () => {
		toast.error("アカウント削除", {
			description: "この操作は取り消せません。本当に削除しますか？",
			action: {
				label: "削除を確認",
				onClick: () => {
					toast.warning("アカウント削除機能は開発中です");
				},
			},
			duration: 10000,
		});
	};

	if (!isOpen) return null;

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title="アカウント設定"
			maxWidthClass="max-w-2xl"
		>
			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="grid w-full grid-cols-5 mx-6 mt-6">
					<TabsTrigger value="profile" className="text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1"
						>
							<circle cx="12" cy="8" r="5" />
							<path d="M20 21a8 8 0 1 0-16 0" />
						</svg>
						プロフィール
					</TabsTrigger>
					<TabsTrigger value="security" className="text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1"
						>
							<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						セキュリティ
					</TabsTrigger>
					<TabsTrigger value="notifications" className="text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1"
						>
							<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
							<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
						</svg>
						通知
					</TabsTrigger>
					<TabsTrigger value="appearance" className="text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1"
						>
							<circle cx="13.5" cy="6.5" r=".5" />
							<circle cx="17.5" cy="10.5" r=".5" />
							<circle cx="8.5" cy="7.5" r=".5" />
							<circle cx="6.5" cy="12.5" r=".5" />
							<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
						</svg>
						外観
					</TabsTrigger>
					<TabsTrigger value="data" className="text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" x2="12" y1="15" y2="3" />
						</svg>
						データ
					</TabsTrigger>
				</TabsList>

				<TabsContent value="profile" className="p-6 space-y-6">
					<ProfileTab
						formData={formData}
						setFormData={setFormData}
						isLoading={isLoading}
						handleSave={handleSave}
					/>
				</TabsContent>
				<TabsContent value="security" className="p-6 space-y-6">
					<SecurityTab
						formData={formData}
						setFormData={setFormData}
						showPasswords={showPasswords}
						setShowPasswords={setShowPasswords}
						isLoading={isLoading}
						handleSave={handleSave}
					/>
				</TabsContent>
				{/* 通知設定 */}
				{/* <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>メール通知</Label>
                    <p className="text-sm text-gray-500">重要な更新をメールで受信</p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>予算警告</Label>
                    <p className="text-sm text-gray-500">予算超過時にアラートを表示</p>
                  </div>
                  <Switch
                    checked={notifications.budgetWarnings}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, budgetWarnings: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>月次レポート</Label>
                    <p className="text-sm text-gray-500">毎月の支出レポートをメール送信</p>
                  </div>
                  <Switch
                    checked={notifications.monthlyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>セキュリティアラート</Label>
                    <p className="text-sm text-gray-500">不審なログインを検知時に通知</p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
                  />
                </div>

                <Button onClick={() => handleSave("通知設定")} disabled={isLoading}>
                  {isLoading ? "保存中..." : "設定を保存"}
                </Button>
              </div>
            </TabsContent> */}

				{/* 外観設定 */}
				{/* <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>テーマ</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <button className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-full h-8 bg-white border rounded mb-2"></div>
                      <span className="text-sm">ライト</span>
                    </button>
                    <button className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-full h-8 bg-gray-800 rounded mb-2"></div>
                      <span className="text-sm">ダーク</span>
                    </button>
                    <button className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="w-full h-8 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
                      <span className="text-sm">システム</span>
                    </button>
                  </div>
                </div>

                <Button onClick={() => handleSave("外観設定")} disabled={isLoading}>
                  {isLoading ? "保存中..." : "設定を保存"}
                </Button>
              </div>
            </TabsContent> */}

				<TabsContent value="data" className="p-6 space-y-6">
					<DataTab
						handleExportData={handleExportData}
						handleDeleteAccount={handleDeleteAccount}
						isLoading={isLoading}
					/>
				</TabsContent>
			</Tabs>
		</BaseModal>
	);
};
