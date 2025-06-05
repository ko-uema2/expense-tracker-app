import type { FC } from "react";

interface GraphIconProps {
	className?: string;
	size?: number;
	color?: string;
}

export const GraphIcon: FC<GraphIconProps> = ({
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
		<title>グラフ</title>
		<path d="M3 3v18h18" />
		<path d="m19 9-5 5-4-4-3 3" />
	</svg>
);
