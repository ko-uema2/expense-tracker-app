import { Done } from "@/components/button";
import { Email, Loading, Password } from "@/components/form";
import { AppAlert } from "@/components/notification";
import { ConfirmAccount } from "@/features/auth/components/ConfirmAccount";
import { AuthInfo } from "@/features/auth/types";
import { authInfoSchema } from "@/utils/schema";
import { Anchor, Checkbox, Paper, Space, Text, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { signUp } from "aws-amplify/auth";
import { FC, FormEvent, memo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp: FC = memo(() => {
  const nav = useNavigate();
  const [errMsg, setErrMsg] = useState<string>("");
  const [opend, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<AuthInfo>({
    validate: zodResolver(authInfoSchema),
    initialValues: {
      email: "",
      password: "",
      confirmationCode: "",
    },
    validateInputOnChange: ["email", "password", "confirmationCode"],
  });

  /**
   * Function to handle form submission.
   *
   * @param {AuthInfo} values - The form values.
   * @param {FormEvent<HTMLFormElement>} event - The form event.
   */
  const handleSubmit = async (
    values: AuthInfo,
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await signUp({
        username: values.email,
        password: values.password,
      });

      console.log(response);

      setLoading(false);
      open();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrMsg(error.message);
      } else {
        setErrMsg("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-start min-h-[900px] bg-cover bg-signup-bg">
      <Paper
        className="border-r border-base-300 dark:border-base-700 min-h-[900px] max-w-[450px] pt-[80px] px-[30px]"
        radius={0}
        p={30}
      >
        <Loading loading={loading} />
        <Title
          order={2}
          className=" text-primary-700"
          ta="center"
          mt="md"
          mb={50}
        >
          Welcome to Index Repository
        </Title>

        {errMsg && (
          <AppAlert
            title="Authorization Error"
            message={errMsg}
            onClick={() => setErrMsg("")}
          />
        )}

        <form
          onSubmit={form.onSubmit((values, event) =>
            handleSubmit(values, event!)
          )}
        >
          <Loading loading={loading} />
          <Email form={form} />
          <Space h="md" />
          <Password form={form} />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Done
            className="mt-5 w-full"
            color="indigo.7"
            label="Sign up"
            type="submit"
          />
        </form>

        <Text ta="center" mt="md">
          Already have an account?{" "}
          <Anchor<"a"> href="#" fw={700} onClick={() => nav("/auth/signin")}>
            Sign In
          </Anchor>
        </Text>
      </Paper>

      <ConfirmAccount opend={opend} close={close} form={form} />
    </div>
  );
});
