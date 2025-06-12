import { Button } from "@/components/ui";
import type { FC, MouseEventHandler, ReactNode } from "react";

interface IconButtonProps {
	icon: ReactNode;
	label?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
	disabled?: boolean;
	variant?:
		| "default"
		| "secondary"
		| "ghost"
		| "destructive"
		| "outline"
		| "link";
	size?: "default" | "sm" | "lg" | "icon";
	title?: string;
}

export const IconButton: FC<IconButtonProps> = ({
	icon,
	label,
	onClick,
	className = "",
	disabled = false,
	variant = "ghost",
	size = "default",
	title,
}) => {
	return (
		<Button
			type="button"
			variant={variant}
			size={size}
			className={className}
			onClick={onClick}
			disabled={disabled}
			title={title}
		>
			{icon}
			{label && <span className="ml-2">{label}</span>}
		</Button>
	);
};
