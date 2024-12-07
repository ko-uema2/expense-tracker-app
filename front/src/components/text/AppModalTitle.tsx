import { FC, memo } from "react";

import { Text } from "@mantine/core";

type Props = {
  label: string;
  textColor?: string;
};

export const AppModalTitle: FC<Props> = memo((props) => {
  const { label, textColor } = props;

  return <Text className={`font-bold text-lg text-${textColor}`}>{label}</Text>;
});

AppModalTitle.displayName = "ModalTitle";
