import type { FC } from "react";

/**
 * 検索用の虫眼鏡アイコン
 * - 例: 検索ボックスの先頭アイコンなど
 */
export const MagnifierIcon: FC<{
	className?: string;
	size?: number;
	color?: string;
}> = ({ className = "", size = 18, color = "currentColor" }) => (
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
		<title>虫眼鏡</title>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
);
