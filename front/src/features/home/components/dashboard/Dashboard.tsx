import { SummaryCards } from "@/features/home/components/dashboard/Cards";
import { ExpenseChart } from "@/features/home/components/dashboard/Chart";
import { ExpenseTable } from "@/features/home/components/dashboard/Table";
import { useExpense } from "@/features/home/components/dashboard/expense-context";

export const Dashboard = () => {
	const {
		selectedMainCategory,
		selectedSubCategory,
		mainCategories,
		getVisibleSubCategories,
	} = useExpense();

	const getCurrentCategory = () => {
		if (!selectedMainCategory) return "すべてのカテゴリ";

		const mainCategory = mainCategories.find(
			(cat) => cat.id === selectedMainCategory,
		);
		if (!mainCategory) return "すべてのカテゴリ";

		if (selectedSubCategory) {
			const subCategory = mainCategory.subCategories.find(
				(sub) => sub.id === selectedSubCategory,
			);
			return subCategory
				? `${mainCategory.name} > ${subCategory.name}`
				: mainCategory.name;
		}

		return mainCategory.name;
	};

	const getSubCategoryCount = () => {
		if (!selectedMainCategory) {
			return mainCategories.reduce(
				(total, cat) => total + getVisibleSubCategories(cat.id).length,
				0,
			);
		}
		return getVisibleSubCategories(selectedMainCategory).length;
	};

	const getDescription = () => {
		const subCategoryCount = getSubCategoryCount();
		if (!selectedMainCategory) {
			return `全${mainCategories.length}カテゴリ・${subCategoryCount}サブカテゴリの月別支出推移と詳細データ`;
		}

		if (selectedSubCategory) {
			return "選択されたサブカテゴリの月別支出推移と詳細データ";
		}

		return `${subCategoryCount}サブカテゴリを含む月別支出推移と詳細データ`;
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{getCurrentCategory()}
					</h1>
					<p className="text-gray-600 mt-1">{getDescription()}</p>
				</div>
				<div className="flex items-center space-x-3">
					<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
						<option>2024年</option>
						<option>2023年</option>
					</select>
					<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
						<option>過去6ヶ月</option>
						<option>過去12ヶ月</option>
						<option>今年</option>
					</select>
				</div>
			</div>

			<SummaryCards />

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-lg font-semibold text-gray-900">月別支出推移</h2>
				</div>
				<ExpenseChart />
			</div>

			<ExpenseTable />
		</div>
	);
};
