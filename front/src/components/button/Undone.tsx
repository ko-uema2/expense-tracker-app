import { FC, memo } from "react";
import React from "react";

import { Button, DefaultMantineColor } from "@mantine/core";

type Props = {
  className?: string;
  color?: DefaultMantineColor;
  label: string;
  onClick: () => void;
};

export const Undone: FC<Props> = memo((props) => {
  const { className, color, label, onClick } = props;

  return (
    <Button
      className={className}
      color={color}
      variant="outline"
      onClick={onClick}
    >
      {label}
    </Button>
  );
});

Undone.displayName = "Undone";
