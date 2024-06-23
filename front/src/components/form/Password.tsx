import { FC, memo } from "react";
import React from "react";

import { PasswordInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { AuthInfo } from "@/features/auth/types";

type Props = {
  form: UseFormReturnType<AuthInfo, (values: AuthInfo) => AuthInfo>;
};

export const Password: FC<Props> = memo(({ form }) => {
  return (
    <PasswordInput
      label="Password"
      placeholder="Your password"
      required
      {...form.getInputProps("password")}
    />
  );
});

Password.displayName = "Password";
