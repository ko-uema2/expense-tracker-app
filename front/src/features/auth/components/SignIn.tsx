import { Done } from "@/components/button";
import { Email, Loading, Password } from "@/components/form";
import { AppAlert } from "@/components/notification";
import { AuthInfo } from "@/features/auth/types";
import { authInfoSchema } from "@/utils/schema";
import {
  Anchor,
  Checkbox,
  Container,
  Group,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useClickOutside } from "@mantine/hooks";
import { signIn } from "aws-amplify/auth";
import { FC, FormEvent, memo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignIn: FC = memo(() => {
  const nav = useNavigate();
  const ref = useClickOutside(() => form.clearErrors());
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const form = useForm<AuthInfo>({
    validate: zodResolver(authInfoSchema),
    initialValues: {
      email: "",
      password: "",
    },
    validateInputOnChange: ["email", "password", "confirmationCode"],
  });

  const handleSubmit = async (
    values: AuthInfo,
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await signIn({
        username: values.email,
        password: values.password,
      });

      console.log(response);

      if (response.isSignedIn) {
        setLoading(false);
        nav("/app");
      }
    } catch (error: unknown) {
      setLoading(false);

      if ((error as Error).name === "UserAlreadyAuthenticatedException") {
        nav("/app");
      } else if (error instanceof Error) {
        setErrMsg(error.message);
        console.error(error);
      } else {
        setErrMsg("An error occurred. Please try again.");
      }
    }
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-extrabold text-primary-700">
        Welcome back !
      </Title>
      <Text className="text-base-500" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor
          className="text-primary-700"
          size="sm"
          component="button"
          onClick={() => nav("/auth/signup")}
        >
          Create account
        </Anchor>
      </Text>

      {errMsg && (
        <div className="mt-3">
          <AppAlert
            title="Authorization Error"
            message={errMsg}
            onClick={() => setErrMsg("")}
          />
        </div>
      )}

      <form
        ref={ref}
        onSubmit={form.onSubmit((values, event) =>
          handleSubmit(values, event!)
        )}
      >
        <Paper withBorder shadow="md" p={30} mt={20} radius="md">
          <Loading loading={loading} />
          <Email form={form} />
          <Space h="md" />
          <Password form={form} />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor className="text-primary-700" component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Done
            className="mt-5 w-full"
            color="primary.7"
            label="Sign in"
            type="submit"
          />
        </Paper>
      </form>
    </Container>
  );
});
