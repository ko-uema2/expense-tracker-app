import type { FC } from "react";

/**
 * ダウンロード（エクスポート）用のアイコン
 * - 例: エクスポートボタンなど
 */
export const DownloadIcon: FC<{
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
		<title>ダウンロード</title>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="7 10 12 15 17 10" />
		<line x1="12" x2="12" y1="15" y2="3" />
	</svg>
);
