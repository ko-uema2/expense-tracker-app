import type { FC } from "react";

interface UploadIconProps {
	className?: string;
	size?: number;
	color?: string;
}

export const UploadIcon: FC<UploadIconProps> = ({
	className = "",
	size = 16,
	color = "currentColor",
}) => (
	<svg
		className={className}
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<title>アップロード</title>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="17 8 12 3 7 8" />
		<line x1="12" x2="12" y1="3" y2="15" />
	</svg>
);
