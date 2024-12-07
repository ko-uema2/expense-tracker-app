import { FC, memo } from "react";

import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { AuthInfo } from "@/features/auth/types";

type Props = {
  form: UseFormReturnType<AuthInfo, (values: AuthInfo) => AuthInfo>;
};

export const Email: FC<Props> = memo(({ form }) => {
  return (
    <TextInput
      label="Email"
      placeholder="hello@example.com"
      autoFocus
      required
      {...form.getInputProps("email")}
    />
  );
});

Email.displayName = "Email";
