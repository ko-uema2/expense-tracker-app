import type { FC } from "react";

/**
 * 警告・エラー用の三角ビックリマークアイコン
 * サイズ・色はpropsでカスタマイズ可能（デフォルト: 48px, text-red-600）
 */
export const TriangleExclamationIcon: FC<{
	size?: number;
	className?: string;
}> = ({ size = 48, className = "text-red-600" }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<title>警告・エラー</title>
		<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
		<path d="M12 9v4" />
		<path d="M12 17h.01" />
	</svg>
);
