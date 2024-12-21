import { Done } from "@/components/button";
import { Email, Loading, Password } from "@/components/form";
import { AppAlert } from "@/components/notification";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import type { AuthInfo } from "@/features/auth/types";
import { NoError } from "@/utils/error";
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
import { memo, useEffect, useState } from "react";
import type { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const SignIn: FC = memo(() => {
	const nav = useNavigate();

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
			<SignInForm />
		</Container>
	);
});

const SignInForm: FC = memo(() => {
	const nav = useNavigate();
	const ref = useClickOutside(() => form.clearErrors());
	const { isSuccessful, isLoading, error, signIn } = useSignIn();
	const [errContent, setErrContent] = useState<
		| {
				title: string;
				message: string;
		  }
		| undefined
	>(undefined);
	const form = useForm<AuthInfo>({
		validate: zodResolver(authInfoSchema),
		initialValues: {
			email: "",
			password: "",
		},
		validateInputOnChange: ["email", "password", "confirmationCode"],
	});

	useEffect(() => {
		if (isSuccessful) {
			nav("/app");
			return;
		}

		if (error instanceof NoError) return;

		setErrContent({
			title: error.title,
			message: error.message,
		});
	}, [isSuccessful, error, nav]);

	const handleSubmit = async (
		values: AuthInfo,
		event: FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		await signIn({
			email: values.email,
			password: values.password,
		});
	};

	return (
		<>
			{errContent && (
				<div className="mt-3">
					<AppAlert
						title={errContent.title}
						message={errContent.message}
						onClick={() => setErrContent(undefined)}
					/>
				</div>
			)}

			<form
				ref={ref}
				onSubmit={form.onSubmit((values, event) =>
					handleSubmit(values, event as FormEvent<HTMLFormElement>),
				)} // TODO: Fix type assertion
			>
				<Paper withBorder shadow="md" p={30} mt={20} radius="md">
					<Loading loading={isLoading} />
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
		</>
	);
});
