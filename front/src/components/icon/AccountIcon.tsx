import type { FC } from "react";

/**
 * アカウント（ユーザー）用のアイコン
 * - 例: ユーザーアバターやプロフィールボタンなど
 */
export const AccountIcon: FC<{
	className?: string;
	size?: number;
	color?: string;
}> = ({ className = "", size = 20, color = "currentColor" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<title>アカウント</title>
		<circle cx="12" cy="8" r="5" />
		<path d="M20 21a8 8 0 1 0-16 0" />
	</svg>
);
