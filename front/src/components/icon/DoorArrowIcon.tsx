import type { FC } from "react";

/**
 * ログアウトや戻るなどのアクションを示す「矢印付きドア」アイコン
 * - 例: ログインページに戻るボタンなど
 */
export const DoorArrowIcon: FC<{
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
		<title>矢印付きドア</title>
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		<polyline points="16 17 21 12 16 7" />
		<line x1="21" x2="9" y1="12" y2="12" />
	</svg>
);
