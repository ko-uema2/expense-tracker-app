import { IconButton } from "@/components/button/IconButton";
import { CrossIcon } from "@/components/icon/CrossIcon";
import type { FC, ReactNode } from "react";

/**
 * 汎用モーダルラッパー
 * - タイトル・クローズボタン・childrenを受け取る
 * - 中央表示・背景マスク・角丸・シャドウ・レスポンシブ
 */
export interface BaseModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	children: ReactNode;
	maxWidthClass?: string; // 例: "max-w-lg" "max-w-4xl"
	bodyClassName?: string;
}

export const BaseModal: FC<BaseModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	maxWidthClass = "max-w-lg",
	bodyClassName = "p-6 overflow-y-auto max-h-[calc(80vh-140px)]",
}) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div
				className={`bg-white rounded-xl shadow-xl w-full mx-4 ${maxWidthClass} max-h-[80vh] overflow-hidden`}
			>
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
					<IconButton
						icon={<CrossIcon size={24} />}
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="bg-transparent text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="閉じる"
					/>
				</div>
				<div className={bodyClassName}>{children}</div>
			</div>
		</div>
	);
};
