import { BaseModal } from "@/components/notification/BaseModal";
import { Button } from "@/components/ui";
import {
	type SubCategory,
	useExpense,
} from "@/features/home/components/dashboard/expense-context";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SubcategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	mainCategoryId: string;
}

const SubcategoryEmptyState = ({ onClose }: { onClose: () => void }) => {
	return (
		<div className="text-center py-8">
			<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-gray-400"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" x2="12" y1="3" y2="15" />
				</svg>
			</div>
			<h3 className="text-lg font-medium text-gray-900 mb-2">
				サブカテゴリがありません
			</h3>
			<p className="text-gray-600 mb-4">
				CSVファイルをアップロードすると、データに含まれるサブカテゴリが自動的に抽出されます。
			</p>
			<Button variant="outline" onClick={onClose}>
				CSVをアップロード
			</Button>
		</div>
	);
};

const SubcategoryStats = ({
	total,
	visible,
	hidden,
}: { total: number; visible: number; hidden: number }) => {
	return (
		<div className="bg-blue-50 rounded-lg p-4">
			<h3 className="font-medium text-blue-900 mb-2">サブカテゴリ統計</h3>
			<div className="grid grid-cols-3 gap-4 text-sm">
				<div className="text-center">
					<div className="text-2xl font-bold text-blue-600">{total}</div>
					<div className="text-blue-700">総数</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-green-600">{visible}</div>
					<div className="text-green-700">表示中</div>
				</div>
				<div className="text-center">
					<div className="text-2xl font-bold text-gray-600">{hidden}</div>
					<div className="text-gray-700">非表示</div>
				</div>
			</div>
		</div>
	);
};

const SubcategoryDataInfo = ({ count }: { count: number }) => {
	if (count === 0) return null;
	return (
		<div className="bg-green-50 border border-green-200 rounded-lg p-4">
			<div className="flex items-start space-x-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-green-600 mt-0.5 flex-shrink-0"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
				<div>
					<p className="text-sm font-medium text-green-800">
						{count}個のサブカテゴリがデータから自動抽出されました
					</p>
					<p className="text-xs text-green-700 mt-1">
						表示・非表示を切り替えて、必要なサブカテゴリのみを表示できます
					</p>
				</div>
			</div>
		</div>
	);
};

const SubcategoryTableRow = ({
	subCategory,
	onToggle,
}: {
	subCategory: SubCategory;
	onToggle: (id: string, name: string, isVisible: boolean) => void;
}) => {
	return (
		<tr
			className={`cursor-pointer transition-colors ${subCategory.isVisible ? "hover:bg-blue-50" : "hover:bg-gray-50 opacity-60"}`}
			onClick={() =>
				onToggle(subCategory.id, subCategory.name, subCategory.isVisible)
			}
		>
			<td className="px-4 py-3">
				<div className="flex items-center">
					{subCategory.isVisible ? (
						<Eye className="h-5 w-5 text-green-600" />
					) : (
						<EyeOff className="h-5 w-5 text-gray-400" />
					)}
				</div>
			</td>
			<td className="px-4 py-3">
				<div className={`w-6 h-6 rounded-full ${subCategory.color}`} />
			</td>
			<td className="px-4 py-3">
				<span
					className={`text-sm font-medium ${subCategory.isVisible ? "text-gray-900" : "text-gray-500"}`}
				>
					{subCategory.name}
				</span>
			</td>
			<td className="px-4 py-3">
				<span
					className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${subCategory.isFromData ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
				>
					{subCategory.isFromData ? "データ" : "デフォルト"}
				</span>
			</td>
		</tr>
	);
};

const SubcategoryTable = ({
	subCategories,
	onToggle,
}: {
	subCategories: SubCategory[];
	onToggle: (id: string, name: string, isVisible: boolean) => void;
}) => {
	return (
		<div className="border rounded-lg overflow-hidden">
			<table className="w-full">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							状態
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							カラー
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							名前
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
							ソース
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{subCategories.map((subCategory) => (
						<SubcategoryTableRow
							key={subCategory.id}
							subCategory={subCategory}
							onToggle={onToggle}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

const SubcategoryGuide = () => {
	return (
		<div className="bg-gray-50 rounded-lg p-4">
			<h4 className="text-sm font-medium text-gray-900 mb-2">操作ガイド</h4>
			<ul className="text-xs text-gray-600 space-y-1">
				<li>• 行をクリックしてサブカテゴリの表示・非表示を切り替えられます</li>
				<li>• 非表示のサブカテゴリはサイドバーに表示されません</li>
				<li>
					• 「データ」ラベルは、CSVファイルから自動抽出されたサブカテゴリです
				</li>
				<li>• 設定は自動的に保存されます</li>
			</ul>
		</div>
	);
};

export const SubcategoryModal = ({
	isOpen,
	onClose,
	mainCategoryId,
}: SubcategoryModalProps) => {
	const { mainCategories, toggleSubCategoryVisibility } = useExpense();
	const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

	// 現在のメインカテゴリ名を取得
	const mainCategory = mainCategories.find((cat) => cat.id === mainCategoryId);
	const mainCategoryName = mainCategory?.name || "";

	// メインカテゴリが変更されたらサブカテゴリを更新
	useEffect(() => {
		if (mainCategoryId) {
			const category = mainCategories.find((cat) => cat.id === mainCategoryId);
			if (category) {
				setSubCategories(category.subCategories);
			}
		}
	}, [mainCategoryId, mainCategories]);

	const handleToggleVisibility = (
		subCategoryId: string,
		subCategoryName: string,
		currentVisibility: boolean,
	) => {
		toggleSubCategoryVisibility(mainCategoryId, subCategoryId);

		toast.success(
			currentVisibility
				? "サブカテゴリを非表示にしました"
				: "サブカテゴリを表示しました",
			{
				description: `${subCategoryName} を${currentVisibility ? "非表示" : "表示"}に設定しました`,
			},
		);
	};

	if (!isOpen) return null;

	const visibleSubCategories = subCategories.filter((sub) => sub.isVisible);
	const hiddenSubCategories = subCategories.filter((sub) => !sub.isVisible);
	const dataSubCategories = subCategories.filter((sub) => sub.isFromData);

	return (
		<BaseModal
			isOpen={isOpen}
			onClose={onClose}
			title={`${mainCategoryName}のサブカテゴリ管理`}
			maxWidthClass="max-w-lg"
		>
			{subCategories.length === 0 ? (
				<SubcategoryEmptyState onClose={onClose} />
			) : (
				<div className="space-y-6">
					<SubcategoryStats
						total={subCategories.length}
						visible={visibleSubCategories.length}
						hidden={hiddenSubCategories.length}
					/>
					<SubcategoryDataInfo count={dataSubCategories.length} />
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium text-gray-900">
								サブカテゴリ一覧
							</h3>
							<div className="text-sm text-gray-500">
								クリックして表示・非表示を切り替え
							</div>
						</div>
						<SubcategoryTable
							subCategories={subCategories}
							onToggle={handleToggleVisibility}
						/>
					</div>
					<SubcategoryGuide />
				</div>
			)}
		</BaseModal>
	);
};
