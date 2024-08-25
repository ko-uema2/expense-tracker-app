import { MonthlyExpenseChart } from "./MontylyExpenseChart";
import { FC, memo } from "react";
import React from "react";

export const Financial: FC = memo(() => {
  return (
    <>
      <MonthlyExpenseChart />
    </>
  );
});

Financial.displayName = "Financial";
