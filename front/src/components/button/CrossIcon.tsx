import { FC, MouseEventHandler, ReactNode, memo } from "react";
import React from "react";

import {
  ActionIcon,
  ActionIconVariant,
  FloatingPosition,
  Tooltip,
} from "@mantine/core";
import { RxCross2 } from "react-icons/rx";

type Props = {
  className?: string;
  label: ReactNode;
  position: FloatingPosition;
  variant: ActionIconVariant;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const CrossIcon: FC<Props> = memo((props) => {
  const { className, label, position, variant, onClick } = props;
  return (
    <Tooltip className="bg-secondary-500" label={label} position={position}>
      <ActionIcon
        className={`text-danger-600 bg-danger-100 ${className}`}
        variant={variant}
        onClick={onClick}
      >
        <RxCross2 />
      </ActionIcon>
    </Tooltip>
  );
});

CrossIcon.displayName = "TrashIcon";
