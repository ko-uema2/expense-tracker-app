import { FileUpload } from "@/features/menu/components/FileUpload";
import { FC, memo } from "react";
import React from "react";

export const Menu: FC = memo(() => {
  return (
    <>
      <FileUpload />
    </>
  );
});

Menu.displayName = "Financial";
