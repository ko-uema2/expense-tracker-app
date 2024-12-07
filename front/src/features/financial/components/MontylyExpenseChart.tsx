import { ExpenseData } from "@/API";
import { useExpData } from "@/features/financial/hooks/useExpData";
import { LineChart } from "@mantine/charts";
import { Grid, SimpleGrid } from "@mantine/core";
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
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Grid>
          <Grid.Col span={12}>
            <LineChart
              className="px-4"
              h={300}
              data={chartData}
              unit="円"
              xAxisLabel="Date"
              dataKey="expenseDate"
              withLegend
              valueFormatter={(value) =>
                new Intl.NumberFormat("en-US").format(value)
              }
              series={[{ name: "regFixedCost", color: "teal.6" }]}
              curveType="linear"
              tickLine="x"
              lineChartProps={{ syncId: "monthly-expense-chart" }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <LineChart
              className="px-4"
              h={300}
              data={chartData}
              unit="円"
              xAxisLabel="Date"
              dataKey="expenseDate"
              withLegend
              valueFormatter={(value) =>
                new Intl.NumberFormat("en-US").format(value)
              }
              series={[{ name: "regVarCost", color: "yellow.6" }]}
              curveType="linear"
              tickLine="x"
              lineChartProps={{ syncId: "monthly-expense-chart" }}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={12}>
            <LineChart
              className="px-4"
              h={300}
              data={chartData}
              unit="円"
              xAxisLabel="Date"
              dataKey="expenseDate"
              withLegend
              valueFormatter={(value) =>
                new Intl.NumberFormat("en-US").format(value)
              }
              series={[{ name: "irregFixedCost", color: "indigo.6" }]}
              curveType="linear"
              tickLine="x"
              lineChartProps={{ syncId: "monthly-expense-chart" }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <LineChart
              className="px-4"
              h={300}
              data={chartData}
              unit="円"
              xAxisLabel="Date"
              dataKey="expenseDate"
              withLegend
              valueFormatter={(value) =>
                new Intl.NumberFormat("en-US").format(value)
              }
              series={[{ name: "irregVarCost", color: "blue.6" }]}
              curveType="linear"
              tickLine="x"
              lineChartProps={{ syncId: "monthly-expense-chart" }}
            />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </>
  );
});

MonthlyExpenseChart.displayName = "MonthlyExpenseChart";
