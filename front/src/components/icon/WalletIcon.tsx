import type { FC } from "react";

interface WalletIconProps {
	className?: string;
	size?: number;
	color?: string;
}

export const WalletIcon: FC<WalletIconProps> = ({
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
		<title>財布</title>
		<rect width="20" height="14" x="2" y="5" rx="2" />
		<line x1="2" x2="22" y1="10" y2="10" />
	</svg>
);
