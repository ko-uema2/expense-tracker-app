import { ExpenseData } from "@/API";
import { useExpData } from "@/features/financial/hooks/useExpData";
import { LineChart } from "@mantine/charts";
import { FC, memo } from "react";

export const MonthlyExpenseChart: FC = memo(() => {
  const { data, error } = useExpData();
  console.log(data, error);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  const chartData = data.data.getExpData?.filter(
    (item): item is Exclude<ExpenseData, null> => item !== null
  );

  if (!chartData) return <div>No data</div>;

  return (
    <>
      <LineChart
        h={300}
        data={chartData}
        dataKey="expenseDate"
        withLegend
        series={[{ name: "regFixedCost", color: "teal.6" }]}
        curveType="linear"
        tickLine="x"
      />
      <LineChart
        h={300}
        data={chartData}
        dataKey="expenseDate"
        withLegend
        series={[{ name: "regVarCost", color: "yellow.6" }]}
        curveType="linear"
        tickLine="x"
      />
      <LineChart
        h={300}
        data={chartData}
        dataKey="expenseDate"
        withLegend
        series={[{ name: "irregFixedCost", color: "indigo.6" }]}
        curveType="linear"
        tickLine="x"
      />
      <LineChart
        h={300}
        data={chartData}
        dataKey="expenseDate"
        withLegend
        series={[{ name: "irregVarCost", color: "blue.6" }]}
        curveType="linear"
        tickLine="x"
      />
    </>
  );
});
