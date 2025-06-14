import type { FC } from "react";

interface DollarIconProps {
	className?: string;
	size?: number;
	color?: string;
}

export const DollarIcon: FC<DollarIconProps> = ({
	className = "",
	size = 28,
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
		<title>ドル</title>
		<line x1="12" x2="12" y1="1" y2="23" />
		<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
	</svg>
);
