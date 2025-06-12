import type { FC } from "react";

interface CheckIconProps {
	className?: string;
	size?: number;
	color?: string;
}

export const CheckIcon: FC<CheckIconProps> = ({
	className = "",
	size = 16,
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
		<title>チェックマーク</title>
		<path d="M20 6 9 17l-5-5" />
	</svg>
);
