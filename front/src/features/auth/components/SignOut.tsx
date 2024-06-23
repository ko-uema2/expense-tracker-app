import { Text, UnstyledButton } from "@mantine/core";
import { signOut } from "aws-amplify/auth";
import { FC, memo } from "react";
import React from "react";
import { BsBoxArrowLeft } from "react-icons/bs";

export const SignOut: FC = memo(() => {
  const handleSignout = async () => {
    try {
      await signOut({ global: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <UnstyledButton
      className="flex text-sm px-2 py-1 my-1 w-full rounded-lg font-medium text-base-500  hover:bg-base-200 hover:text-base-800"
      onClick={handleSignout}
    >
      <BsBoxArrowLeft className="h-6 w-6 mr-3" />
      <Text className="w-28">Sign out</Text>
    </UnstyledButton>
  );
});

SignOut.displayName = "SignOut";
