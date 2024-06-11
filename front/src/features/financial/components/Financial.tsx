import { MonthlyExpenseChart } from "./MontylyExpenseChart";
import { FileUpload } from "./FileUpload";
import { FC, memo } from "react";

export const Financial: FC = memo(() => {
  return (
    <>
      <FileUpload />
      <MonthlyExpenseChart />
    </>
  );
});
