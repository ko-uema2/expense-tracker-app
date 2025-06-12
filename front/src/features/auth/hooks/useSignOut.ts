import { SignInException } from "@/features/auth/error/const";
import { AuthError } from "@/features/auth/error/error";
import { type AppError, NoError, UnknownError } from "@/utils/error";
import { signOut as cognitoSignOut } from "aws-amplify/auth";
import { useCallback, useReducer } from "react";

// State型定義
type State = {
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

// Action型定義
type Action =
	| { type: "SIGN_OUT_START" }
	| { type: "SIGN_OUT_SUCCESS" }
	| { type: "SIGN_OUT_FAILURE"; payload: AppError };

const initialState: State = {
	isLoading: false,
	isSuccessful: false,
	error: new NoError(),
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SIGN_OUT_START":
			return {
				...state,
				isLoading: true,
				isSuccessful: false,
				error: new NoError(),
			};
		case "SIGN_OUT_SUCCESS":
			return {
				...state,
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			};
		case "SIGN_OUT_FAILURE":
			return {
				...state,
				isLoading: false,
				isSuccessful: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

/**
 * サインアウト用カスタムフック
 */
export const useSignOut = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const signOut = useCallback(async (): Promise<void> => {
		dispatch({ type: "SIGN_OUT_START" });
		try {
			await cognitoSignOut({ global: true });
			dispatch({ type: "SIGN_OUT_SUCCESS" });
		} catch (error: unknown) {
			const occurredError =
				error instanceof Error &&
				Object.values(SignInException).includes(
					(error as AppError).code as SignInException,
				)
					? new AuthError((error as AppError).code as SignInException)
					: new UnknownError();

			dispatch({ type: "SIGN_OUT_FAILURE", payload: occurredError });
		}
	}, []);

	return {
		...state,
		signOut,
	};
};
