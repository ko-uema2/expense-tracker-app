import { FC, MouseEventHandler, ReactNode, memo } from "react";
import React from "react";

import {
  ActionIcon,
  ActionIconVariant,
  FloatingPosition,
  Tooltip,
} from "@mantine/core";
import { HiOutlinePlus } from "react-icons/hi";

type Props = {
  className?: string;
  label: ReactNode;
  position: FloatingPosition;
  variant: ActionIconVariant;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const PlusIcon: FC<Props> = memo((props) => {
  const { className, label, position, variant, onClick } = props;
  return (
    <Tooltip className="bg-primary-700" position={position} label={label}>
      <ActionIcon
        className={`text-primary-700 border-primary-700 hover:text-primary-700 hover:bg-primary-100 ${className}`}
        variant={variant}
        onClick={onClick}
      >
        <HiOutlinePlus />
      </ActionIcon>
    </Tooltip>
  );
});

PlusIcon.displayName = "PlusIcon";
