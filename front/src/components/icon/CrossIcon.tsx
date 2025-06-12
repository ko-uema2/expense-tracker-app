import type { FC } from "react";

interface CrossIconProps {
	className?: string;
	size?: number;
	color?: string;
}

export const CrossIcon: FC<CrossIconProps> = ({
	className = "",
	size = 24,
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
		<title>バツ</title>
		<path d="M18 6 6 18" />
		<path d="M6 6l12 12" />
	</svg>
);
