import { FC, ReactNode, memo } from "react";
import React from "react";

import { Alert } from "@mantine/core";
import { SlExclamation } from "react-icons/sl";

type Props = {
  title: ReactNode;
  message: ReactNode;
  onClick: () => void;
};

export const AppAlert: FC<Props> = memo((props) => {
  const { title, message, onClick } = props;

  return (
    <Alert
      icon={<SlExclamation />}
      title={title}
      color="danger.5"
      withCloseButton
      onClick={onClick}
    >
      {message}
    </Alert>
  );
});

AppAlert.displayName = "AppAlert";
