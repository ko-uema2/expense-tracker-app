import { SignIn } from "@/features/auth/components/SignIn";
import { AuthError, SignInException } from "@/features/auth/error";
import { useSignIn } from "@/features/auth/hooks";
import { NoError } from "@/utils/error";
import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

// Mock the useSignIn hook
jest.mock("@/features/auth/hooks/useSignIn", () => ({
	useSignIn: jest.fn(),
}));

const mockedUseSignIn = useSignIn as jest.MockedFunction<typeof useSignIn>;

describe("SignIn Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const renderWithProviders = (ui: ReactElement) => {
		return render(
			<BrowserRouter>
				<MantineProvider>{ui}</MantineProvider>
			</BrowserRouter>,
		);
	};

	test("renders the sign-in form", () => {
		// Mock the useSignIn hook
		mockedUseSignIn.mockReturnValue({
			isLoading: false,
			isSuccessful: false,
			error: new NoError(),
			signIn: jest.fn(),
		});

		renderWithProviders(<SignIn />);

		expect(screen.queryByText(/Welcome back/i)).toBeInTheDocument();
		expect(screen.queryByText(/Create account/i)).toBeInTheDocument();
		expect(screen.getAllByRole("button", { name: "Sign in" })).toHaveLength(1);
	});

	test("navigate to main page on successful sign-in", () => {
		const mockSignIn = jest.fn().mockResolvedValue({});

		// Mock the useSignIn hook
		mockedUseSignIn.mockReturnValue({
			isLoading: false,
			isSuccessful: true,
			error: new NoError(),
			signIn: mockSignIn,
		});

		renderWithProviders(<SignIn />);

		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "hoge@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: "password" },
		});

		fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

		waitFor(() => {
			expect(mockSignIn).toHaveBeenCalledWith({
				email: "hoge@example.com",
				password: "password",
			});
		});
	});

	test("renders an error message if the sign-in fails", () => {
		const mockSignIn = jest
			.fn()
			.mockRejectedValue(new AuthError(SignInException.UserNotFoundException));

		// Mock the useSignIn hook
		mockedUseSignIn.mockReturnValue({
			isLoading: false,
			isSuccessful: false,
			error: new AuthError(SignInException.UserNotFoundException),
			signIn: mockSignIn,
		});

		renderWithProviders(<SignIn />);

		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "wrong@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/Password/i), {
			target: { value: "password" },
		});

		fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

		waitFor(() => {
			expect(mockSignIn).toHaveBeenCalledWith({
				email: "wrong@example.com",
				password: "password",
			});
			expect(
				screen.queryByText(
					"ユーザーが見つかりません。メールアドレスをもう一度確認してください。",
					// "state初期値",
				),
			).toBeInTheDocument();
			expect(screen.queryByText("ログインエラー")).toBeInTheDocument();
			// expect(mockedUseSignIn().error).toBeInstanceOf(AuthError);
		});
	});
});
