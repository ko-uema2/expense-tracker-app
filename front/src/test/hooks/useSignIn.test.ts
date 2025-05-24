import { AuthError, SignInException } from "@/features/auth/error";
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
		expect(result.current.isSuccessful).toBe(true);
		expect(result.current.error).toBeInstanceOf(NoError);
		expect(signIn).toHaveBeenCalledWith({
			username: "hoge@example.com",
			password: "password",
		});
	});

	test("should set an error message if the sign-in fails due to incorrect email", async () => {
		// Mock the error object
		const error = new AuthError(SignInException.UserNotFoundException);
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
		const error = new AuthError(SignInException.NotAuthorizedException);
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
		const error = new AuthError(SignInException.CodeDeliveryFailureException);
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
		const error = new AuthError(SignInException.InternalErrorException);
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
		const error = new UnknownError();
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
