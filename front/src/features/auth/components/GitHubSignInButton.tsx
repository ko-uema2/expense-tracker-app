import { GitHubIcon } from "@/components/icon/GitHubIcon";
import { Button } from "@/components/ui";
import type { ButtonHTMLAttributes, FC } from "react";

interface GitHubSignInButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	// 追加のpropsがあればここに
}

export const GitHubSignInButton: FC<GitHubSignInButtonProps> = ({
	...props
}) => (
	<Button
		variant="outline"
		className="w-full h-12 border-gray-200 hover:bg-gray-50"
		{...props}
	>
		<GitHubIcon className="w-5 h-5 mr-3" size={20} />
		GitHubでサインイン
	</Button>
);
