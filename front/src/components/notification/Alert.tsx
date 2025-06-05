import { IconButton } from "@/components/button/IconButton";
import { CircleCrossIcon } from "@/components/icon/CircleCrossIcon";
import { CrossIcon } from "@/components/icon/CrossIcon";
import { InfoCircleIcon } from "@/components/icon/InfoCircleIcon";
import { TriangleExclamationIcon } from "@/components/icon/TriangleExclamationIcon";
import { type FC, type ReactNode, memo } from "react";

type Props = {
	message: ReactNode;
	onClick: () => void;
	errorType?: "error" | "warning" | "info";
};

export const Alert: FC<Props> = memo((props) => {
	const { message, onClick, errorType = "error" } = props;

	const getIcon = () => {
		switch (errorType) {
			case "error":
				return (
					<CircleCrossIcon className="text-red-500 flex-shrink-0" size={20} />
				);
			case "warning":
				return (
					<TriangleExclamationIcon
						className="text-yellow-500 flex-shrink-0"
						size={20}
					/>
				);
			case "info":
				return (
					// インフォサークル
					<InfoCircleIcon className="text-blue-500 flex-shrink-0" size={20} />
				);
		}
	};

	const getStyles = () => {
		switch (errorType) {
			case "error":
				return "bg-red-50 border-red-200 text-red-800";
			case "warning":
				return "bg-yellow-50 border-yellow-200 text-yellow-800";
			case "info":
				return "bg-blue-50 border-blue-200 text-blue-800";
		}
	};

	return (
		<div className={`rounded-lg border p-4 ${getStyles()}`}>
			<div className="flex items-start space-x-3">
				{getIcon()}
				<div className="flex-1">
					<p className="text-sm font-medium">{message}</p>
				</div>
				<IconButton
					icon={<CrossIcon size={16} />}
					variant="ghost"
					size="icon"
					onClick={onClick}
					className="bg-transparent text-gray-400 hover:text-gray-600"
					aria-label="閉じる"
				/>
			</div>
		</div>
	);
});
