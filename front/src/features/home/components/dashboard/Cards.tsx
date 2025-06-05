import { DollarIcon } from "@/components/icon/DollarIcon";
import { GraphIcon } from "@/components/icon/GraphIcon";
import { WalletIcon } from "@/components/icon/WalletIcon";
import { useExpense } from "@/features/home/components/dashboard/expense-context";

const SummaryCard = ({
	title,
	value,
	icon,
	children,
	subInfo,
}: {
	title: string;
	value: string;
	icon: React.ReactNode;
	children?: React.ReactNode;
	subInfo?: React.ReactNode;
}) => (
	<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-600">{title}</p>
				<p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
			</div>
			<div className="w-12 h-12 rounded-lg flex items-center justify-center">
				{icon}
			</div>
		</div>
		{children}
		{subInfo && <div className="mt-4">{subInfo}</div>}
	</div>
);

const BudgetCard = ({ total, budget }: { total: number; budget: number }) => (
	<SummaryCard
		title="予算残高"
		value={`¥${(budget - total).toLocaleString()}`}
		icon={<WalletIcon className="text-purple-600 bg-purple-100" size={24} />}
		subInfo={
			<>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-purple-600 h-2 rounded-full"
						style={{ width: `${Math.min((total / budget) * 100, 100)}%` }}
					/>
				</div>
				<span className="text-sm text-gray-600 mt-1 block">
					予算: ¥{budget.toLocaleString()}
				</span>
			</>
		}
	/>
);

export const SummaryCards = () => {
	const {
		selectedMainCategory,
		selectedSubCategory,
		expenseData,
		mainCategories,
	} = useExpense();

	const calculateSummary = () => {
		if (!selectedMainCategory) {
			// すべてのカテゴリの合計
			const total = expenseData.reduce((sum, month) => {
				return (
					sum +
					mainCategories.reduce(
						(catSum, cat) => catSum + (month[cat.id] as number),
						0,
					)
				);
			}, 0);
			const average = total / expenseData.length;
			const lastMonth = expenseData[expenseData.length - 1];
			const secondLastMonth = expenseData[expenseData.length - 2];
			const lastMonthTotal = mainCategories.reduce(
				(sum, cat) => sum + (lastMonth[cat.id] as number),
				0,
			);
			const secondLastMonthTotal = mainCategories.reduce(
				(sum, cat) => sum + (secondLastMonth[cat.id] as number),
				0,
			);
			const change =
				((lastMonthTotal - secondLastMonthTotal) / secondLastMonthTotal) * 100;

			return { total: lastMonthTotal, average, change };
		}

		const key = selectedSubCategory || selectedMainCategory;
		const total = expenseData.reduce(
			(sum, month) => sum + (month[key] as number),
			0,
		);
		const average = total / expenseData.length;
		const lastMonth = expenseData[expenseData.length - 1][key] as number;
		const secondLastMonth = expenseData[expenseData.length - 2][key] as number;
		const change = ((lastMonth - secondLastMonth) / secondLastMonth) * 100;

		return { total: lastMonth, average, change };
	};

	const { total, average, change } = calculateSummary();
	const budget = 80000;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<SummaryCard
				title="今月の支出"
				value={`¥${total.toLocaleString()}`}
				icon={<DollarIcon className="text-blue-600 bg-blue-100" size={24} />}
				subInfo={
					<div className="flex items-center mt-4">
						<span
							className={`text-sm font-medium ${
								change >= 0 ? "text-red-600" : "text-green-600"
							}`}
						>
							{change >= 0 ? "+" : ""}
							{change.toFixed(1)}%
						</span>
						<span className="text-sm text-gray-600 ml-2">前月比</span>
					</div>
				}
			/>
			<SummaryCard
				title="月平均支出"
				value={`¥${Math.round(average).toLocaleString()}`}
				icon={<GraphIcon className="text-green-600 bg-green-100" size={24} />}
				subInfo={
					<span className="text-sm text-gray-600 mt-4 block">
						過去6ヶ月の平均
					</span>
				}
			/>
			<BudgetCard total={total} budget={budget} />
		</div>
	);
};
