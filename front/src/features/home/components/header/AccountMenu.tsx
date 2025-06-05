import { AccountIcon } from "@/components/icon";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/features/auth";
import { AccountSettingsModal } from "@/features/home/components/header/AccountSettingsModal";
import { useState } from "react";

interface AccountMenuProps {
	userEmail?: string;
	userName?: string;
}

export const AccountMenu = ({
	userEmail = "user@example.com",
	userName = "山田太郎",
}: AccountMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { signOut, isLoading: isSignOutLoading } = useSignOut();

	const handleMenuAction = async (action: string) => {
		setIsOpen(false);

		switch (action) {
			case "profile":
			case "email":
			case "password":
				setIsSettingsOpen(true);
				break;
			case "logout":
				await signOut();
				window.location.href = "/signin";
				break;
		}
	};

	return (
		<>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger className="bg-transparent outline-none">
					<div className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-200 flex items-center justify-center overflow-hidden">
						<AccountIcon size={20} className=" lucide lucide-user" />
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end">
					<div className="px-4 py-3">
						<p className="text-sm font-medium text-gray-900">{userName}</p>
						<p className="text-xs text-gray-500 mt-1">{userEmail}</p>
						<div className="mt-2 pt-2 border-t border-gray-100">
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								無料プラン
							</span>
							<span className="inline-flex items-center ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
								アクティブ
							</span>
						</div>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => handleMenuAction("profile")}>
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
							<circle cx="12" cy="8" r="5" />
							<path d="M20 21a8 8 0 1 0-16 0" />
						</svg>
						プロフィール設定
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => handleMenuAction("email")}>
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
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
						メールアドレス変更
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => handleMenuAction("password")}>
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
							<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
							<circle cx="12" cy="16" r="1" />
						</svg>
						パスワード変更
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onSelect={() => handleMenuAction("logout")}
						disabled={isSignOutLoading}
					>
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
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" x2="9" y1="12" y2="12" />
						</svg>
						サインアウト
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AccountSettingsModal
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	);
};
