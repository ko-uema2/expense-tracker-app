"use client";

import { useExpense } from "@/features/home/components/dashboard/expense-context";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export const ExpenseChart = () => {
	const {
		selectedMainCategory,
		selectedSubCategory,
		expenseData,
		mainCategories,
		getVisibleSubCategories,
	} = useExpense();

	const getChartData = () => {
		if (!selectedMainCategory) {
			// すべてのカテゴリを表示
			return expenseData.map((month) => ({
				month: month.month,
				...mainCategories.reduce(
					(acc, cat) => ({
						...acc,
						[cat.name]: month[cat.id],
					}),
					{},
				),
			}));
		}

		const mainCategory = mainCategories.find(
			(cat) => cat.id === selectedMainCategory,
		);
		if (!mainCategory) return [];

		if (selectedSubCategory) {
			// 選択された中項目のみ表示
			const subCategory = mainCategory.subCategories.find(
				(sub) => sub.id === selectedSubCategory,
			);
			return expenseData.map((month) => ({
				month: month.month,
				[subCategory?.name || ""]: month[selectedSubCategory],
			}));
		}

		// 選択された大項目の表示中の中項目をすべて表示
		const visibleSubCategories = getVisibleSubCategories(mainCategory.id);
		return expenseData.map((month) => ({
			month: month.month,
			...visibleSubCategories.reduce(
				(acc, sub) => ({
					...acc,
					[sub.name]: month[sub.id],
				}),
				{},
			),
			[mainCategory.name]: month[mainCategory.id],
		}));
	};

	const chartData = getChartData();
	const colors = [
		"#3B82F6",
		"#EF4444",
		"#10B981",
		"#F59E0B",
		"#8B5CF6",
		"#EC4899",
		"#06B6D4",
		"#84CC16",
		"#F97316",
		"#6366F1",
	];

	return (
		<div className="h-80">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
					<XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
					<YAxis
						stroke="#6b7280"
						fontSize={12}
						tickFormatter={(value) => `¥${value / 1000}k`}
					/>
					<Tooltip
						formatter={(value: number) => [`¥${value.toLocaleString()}`, ""]}
						labelStyle={{ color: "#374151" }}
						contentStyle={{
							backgroundColor: "white",
							border: "1px solid #e5e7eb",
							borderRadius: "8px",
							boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
						}}
					/>
					{Object.keys(chartData[0] || {})
						.filter((key) => key !== "month")
						.map((key, index) => (
							<Line
								key={key}
								type="monotone"
								dataKey={key}
								stroke={colors[index % colors.length]}
								strokeWidth={2}
								dot={{
									fill: colors[index % colors.length],
									strokeWidth: 2,
									r: 4,
								}}
								activeDot={{
									r: 6,
									stroke: colors[index % colors.length],
									strokeWidth: 2,
								}}
							/>
						))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};
