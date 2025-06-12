import { GoogleIcon } from "@/components/icon/GoogleIcon";
import { Button } from "@/components/ui";
import type { ButtonHTMLAttributes, FC } from "react";

interface GoogleSignInButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	// 追加のpropsがあればここに
}

export const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
	...props
}) => (
	<Button
		variant="outline"
		className="w-full h-12 border-gray-200 hover:bg-gray-50"
		{...props}
	>
		<GoogleIcon className="w-5 h-5 mr-3" size={20} />
		Googleでサインイン
	</Button>
);
