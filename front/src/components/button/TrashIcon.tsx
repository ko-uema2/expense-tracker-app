import { FC, MouseEventHandler, ReactNode, memo } from "react";
import React from "react";

import {
  ActionIcon,
  ActionIconVariant,
  FloatingPosition,
  Tooltip,
} from "@mantine/core";
import { PiTrashThin } from "react-icons/pi";

type Props = {
  className?: string;
  label: ReactNode;
  position: FloatingPosition;
  variant: ActionIconVariant;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const TrashIcon: FC<Props> = memo((props) => {
  const { className, label, position, variant, onClick } = props;
  return (
    <Tooltip className="bg-secondary-500" label={label} position={position}>
      <ActionIcon
        className={`text-secondary-500 hover:text-secondary-500 ${className}`}
        variant={variant}
        onClick={onClick}
      >
        <PiTrashThin />
      </ActionIcon>
    </Tooltip>
  );
});

TrashIcon.displayName = "TrashIcon";
