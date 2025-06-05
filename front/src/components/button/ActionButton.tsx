import { Button } from "@/components/ui";
import type { FC, ReactNode } from "react";

interface ActionButtonProps {
	label: ReactNode;
	onClick?: () => void;
	isLoading?: boolean;
	loadingLabel?: ReactNode;
	className?: string;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	icon?: ReactNode;
	variant?: "default" | "destructive" | "outline" | "ghost";
	fullWidth?: boolean;
	height?: string;
}

export const ActionButton: FC<ActionButtonProps> = ({
	label,
	onClick,
	isLoading = false,
	loadingLabel,
	className = "",
	type = "button",
	disabled = false,
	icon,
	variant = "default",
	fullWidth = true,
	height = "h-12",
}) => {
	const base = `${fullWidth ? "w-full" : ""} ${height} font-medium rounded transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500`;
	return (
		<Button
			type={type}
			variant={variant}
			className={`${base} ${className}`}
			onClick={onClick}
			disabled={isLoading || disabled}
		>
			{isLoading ? (
				<div className="flex items-center">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
					{loadingLabel || label}
				</div>
			) : (
				<>
					{icon && <span className="mr-2">{icon}</span>}
					{label}
				</>
			)}
		</Button>
	);
};
