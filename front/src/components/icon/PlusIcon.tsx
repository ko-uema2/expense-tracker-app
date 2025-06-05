import type { FC } from "react";

/**
 * プラス（追加）用のアイコン
 * - 例: 追加ボタンなど
 */
export const PlusIcon: FC<{
	className?: string;
	size?: number;
	color?: string;
}> = ({ className = "", size = 16, color = "currentColor" }) => (
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
		<title>プラス</title>
		<path d="M5 12h14" />
		<path d="M12 5v14" />
	</svg>
);
