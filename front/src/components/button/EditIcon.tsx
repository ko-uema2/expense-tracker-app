import { FC, MouseEventHandler, ReactNode, memo } from "react";
import React from "react";

import {
  ActionIcon,
  ActionIconVariant,
  FloatingPosition,
  Tooltip,
} from "@mantine/core";
import { PiPencilThin } from "react-icons/pi";

type Props = {
  label: ReactNode;
  position: FloatingPosition;
  variant: ActionIconVariant;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const EditIcon: FC<Props> = memo((props) => {
  const { label, position, variant, onClick } = props;
  return (
    <Tooltip className="bg-primary-700" label={label} position={position}>
      <ActionIcon
        className="text-primary-700"
        variant={variant}
        onClick={onClick}
      >
        <PiPencilThin className="text-primary-700" />
      </ActionIcon>
    </Tooltip>
  );
});

EditIcon.displayName = "EditIcon";
