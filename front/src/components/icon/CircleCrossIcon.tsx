import type { FC } from "react";

interface ErrorCrossIconProps {
	className?: string;
	size?: number;
	color?: string;
}

// 丸で囲まれたバツ印アイコン
export const CircleCrossIcon: FC<ErrorCrossIconProps> = ({
	className = "",
	size = 20,
	color = "currentColor",
}) => (
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
		<title>エラー</title>
		<circle cx="12" cy="12" r="10" />
		<line x1="15" x2="9" y1="9" y2="15" />
		<line x1="9" x2="15" y1="9" y2="15" />
	</svg>
);
