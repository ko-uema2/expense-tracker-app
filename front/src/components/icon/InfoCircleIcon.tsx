import type { FC } from "react";

/**
 * インフォメーション（iマーク）サークルアイコン
 * - 情報・お知らせ・infoレベルのアラート等に
 */
export const InfoCircleIcon: FC<{
	className?: string;
	size?: number;
	color?: string;
}> = ({ className = "", size = 20, color = "currentColor" }) => (
	<svg
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
		<title>インフォメーション</title>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" />
		<path d="M12 8h.01" />
	</svg>
);
