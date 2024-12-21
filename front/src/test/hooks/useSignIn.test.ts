import { AuthError, AuthErrorNames } from "@/features/auth/error";
import { useSignIn } from "@/features/auth/hooks";
import { NoError, UnknownError } from "@/utils/error";
import { renderHook } from "@testing-library/react";
import { signIn } from "aws-amplify/auth";
import { act } from "react";

jest.mock("aws-amplify/auth", () => ({
	signIn: jest.fn(),
}));

describe("useSignIn", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test case: Verifying the properties of the hook's return object.
	 *
	 * This test ensures that the `useSignIn` hook returns an object with the correct properties.
	 */
	test("should return an object with the correct properties", () => {
		const { result } = renderHook(() => useSignIn());

		expect(result.current).toHaveProperty("error");
		expect(result.current).toHaveProperty("isLoading");
		expect(result.current).toHaveProperty("isSuccessful");
		expect(result.current).toHaveProperty("signIn");
	});

	/**
	 * Test case: Successful sign-in.
	 *
	 * This test ensures that a user can sign in successfully and the correct parameters are passed to the `signIn` function.
	 */
	test("should sign in successfully", async () => {
		(signIn as jest.Mock).mockResolvedValue({});

		const { result } = renderHook(() => useSignIn());

		await act(async () => {
			await result.current.signIn({
				email: "hoge@example.com",
				password: "password",
			});
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccessful).toBe(false);
		expect(result.current.error).toBeInstanceOf(NoError);
		expect(signIn).toHaveBeenCalledWith({
			username: "hoge@example.com",
			password: "password",
		});
	});

	test("should set an error message if the sign-in fials due to incorrect email", async () => {
		// Mock the error object
		const error = new Error("User does not exist.") as Error & {
			name: string;
		};
		error.name = AuthErrorNames.UserNotFoundException;
		(signIn as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useSignIn());

		await act(async () => {
			await result.current.signIn({
				email: "wrong@example.com",
				password: "password",
			});
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccessful).toBe(false);
		expect(result.current.error).toBeInstanceOf(AuthError);
		expect(result.current.error.message).toBe(
			"ユーザーが見つかりません。メールアドレスをもう一度確認してください。",
		);
	});

	test("should set an error message if the sign-in fails due to incorrect password", async () => {
		// Mock the error object
		const error = new Error(
			"メールアドレスまたはパスワードが間違っています",
		) as Error & {
			name: string;
		};
		error.name = AuthErrorNames.NotAuthorizedException;
		(signIn as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useSignIn());

		await act(async () => {
			await result.current.signIn({
				email: "wrong@example.com",
				password: "password",
			});
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccessful).toBe(false);
		expect(result.current.error).toBeInstanceOf(AuthError);
		expect(result.current.error.message).toBe(error.message);
	});

	test("should set an error message if the sign-in fails due to code delivery failure", async () => {
		// Mock the error object
		const error = new Error(
			"確認コードの送信に失敗しました。しばらく時間を置いてから再度お試しください。",
		) as Error & {
			name: string;
		};
		error.name = AuthErrorNames.CodeDeliveryFailureException;
		(signIn as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useSignIn());

		await act(async () => {
			await result.current.signIn({
				email: "hoge@exmaple.com",
				password: "password",
			});
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccessful).toBe(false);
		expect(result.current.error).toBeInstanceOf(AuthError);
		expect(result.current.error.message).toBe(error.message);
	});

	test("should set an error message if the sign-in fails due to internal server error", async () => {
		// Mock the error object
		const error = new Error("認証処理で内部エラーが発生しました。") as Error & {
			name: string;
		};
		error.name = AuthErrorNames.InternalErrorException;
		(signIn as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useSignIn());

		await act(async () => {
			await result.current.signIn({
				email: "hoge@exmaple.com",
				password: "password",
			});
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccessful).toBe(false);
		expect(result.current.error).toBeInstanceOf(AuthError);
		expect(result.current.error.message).toBe(error.message);
	});

	test("should set an error message if the sign-in fails due to an unknown error", async () => {
		// Mock the error object
		const error = new Error("An unknown error occurred.") as Error & {
			name: string;
		};
		error.name = "UnknownError";
		(signIn as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useSignIn());

		await act(async () => {
			await result.current.signIn({
				email: "hoge@example.com",
				password: "password",
			});
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isSuccessful).toBe(false);
		expect(result.current.error).toBeInstanceOf(UnknownError);
		expect(result.current.error.message).toBe(error.message);
	});
});
