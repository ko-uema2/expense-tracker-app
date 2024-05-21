import { FC, memo } from "react";

import { Button, DefaultMantineColor } from "@mantine/core";

type ButtonType = "submit" | "button" | "reset";

type Props = {
  className?: string;
  color?: DefaultMantineColor;
  label: string;
  type?: ButtonType;
  onClick?: () => void;
};

export const Done: FC<Props> = memo((props) => {
  const { className, color, label, type, onClick } = props;

  return (
    <Button className={className} color={color} type={type} onClick={onClick}>
      {label}
    </Button>
  );
});

Done.displayName = "Done";
