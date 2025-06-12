"use client";

import { useExpense } from "@/features/home/components/dashboard/expense-context";

const ExpenseTableContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200">
			{children}
		</div>
	);
};

const ExpenseTableTitle = () => {
	return (
		<div className="p-6 border-b border-gray-200">
			<h2 className="text-lg font-semibold text-gray-900">詳細データ</h2>
		</div>
	);
};

const ExpenseTableHeader = ({
	categories,
}: { categories: { name: string }[] }) => {
	return (
		<thead className="bg-gray-50">
			<tr>
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					月
				</th>
				{categories.map((cat, index) => (
					<th
						key={index}
						className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
					>
						{cat.name}
					</th>
				))}
				<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					合計
				</th>
			</tr>
		</thead>
	);
};

const ExpenseTableCell = ({
	color,
	amount,
}: { color: string; amount: number }) => {
	return (
		<div className="flex items-center">
			<div className={`w-3 h-3 rounded-full ${color} mr-2`} />¥
			{amount.toLocaleString()}
		</div>
	);
};

const ExpenseTableRow = ({ row }: { row: any }) => {
	return (
		<tr className="hover:bg-gray-50">
			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				{row.month}
			</td>
			{row.categories.map((cat: any, catIndex: number) => (
				<td
					key={catIndex}
					className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
				>
					<ExpenseTableCell color={cat.color} amount={cat.amount} />
				</td>
			))}
			<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
				¥{row.total.toLocaleString()}
			</td>
		</tr>
	);
};

const ExpenseTableMain = ({ tableData }: { tableData: any[] }) => {
	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<ExpenseTableHeader categories={tableData[0]?.categories || []} />
				<tbody className="bg-white divide-y divide-gray-200">
					{tableData.map((row, index) => (
						<ExpenseTableRow key={index} row={row} />
					))}
				</tbody>
			</table>
		</div>
	);
};

export const ExpenseTable = () => {
	const {
		selectedMainCategory,
		selectedSubCategory,
		expenseData,
		mainCategories,
		getVisibleSubCategories,
	} = useExpense();

	const getTableData = () => {
		if (!selectedMainCategory) {
			return expenseData.map((month) => ({
				month: month.month,
				categories: mainCategories.map((cat) => ({
					name: cat.name,
					amount: month[cat.id] as number,
					color: cat.color,
				})),
				total: mainCategories.reduce(
					(sum, cat) => sum + (month[cat.id] as number),
					0,
				),
			}));
		}

		const mainCategory = mainCategories.find(
			(cat) => cat.id === selectedMainCategory,
		);
		if (!mainCategory) return [];

		if (selectedSubCategory) {
			const subCategory = mainCategory.subCategories.find(
				(sub) => sub.id === selectedSubCategory,
			);
			return expenseData.map((month) => ({
				month: month.month,
				categories: [
					{
						name: subCategory?.name || "",
						amount: month[selectedSubCategory] as number,
						color: subCategory?.color || "",
					},
				],
				total: month[selectedSubCategory] as number,
			}));
		}

		const visibleSubCategories = getVisibleSubCategories(mainCategory.id);
		return expenseData.map((month) => ({
			month: month.month,
			categories: visibleSubCategories.map((sub) => ({
				name: sub.name,
				amount: month[sub.id] as number,
				color: sub.color,
			})),
			total: month[mainCategory.id] as number,
		}));
	};

	const tableData = getTableData();

	return (
		<ExpenseTableContainer>
			<ExpenseTableTitle />
			<ExpenseTableMain tableData={tableData} />
		</ExpenseTableContainer>
	);
};
