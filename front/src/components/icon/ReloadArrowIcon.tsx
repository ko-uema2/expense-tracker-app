import type { FC } from "react";

/**
 * 2本の曲がった矢印が円を描く「リフレッシュサークル」アイコン
 * ページ再読み込みやリフレッシュなど、汎用的な用途で利用可能
 */
export const RefreshCircleIcon: FC<{
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
		<title>リフレッシュサークル</title>
		<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
		<path d="M21 3v5h-5" />
		<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
		<path d="M3 21v-5h5" />
	</svg>
);
