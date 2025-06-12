import { SignUpException } from "@/features/auth/error/const";
import { AuthError } from "@/features/auth/error/error";
import type { SignUpInfo } from "@/features/auth/types";
import { type AppError, NoError, UnknownError } from "@/utils/error";
import { signUp as cognitoSignUp } from "aws-amplify/auth";
import { useCallback, useReducer } from "react";

// Define the shape of the state object
type State = {
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

// Define the shape of the action object
type Action =
	| { type: "SIGN_UP_START" }
	| { type: "SIGN_UP_SUCCESS" }
	| { type: "SIGN_UP_FAILURE"; payload: AppError };

// Define the initial state
const initialState: State = {
	isLoading: false,
	isSuccessful: false,
	error: new NoError(),
};

// Define the reducer function
const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SIGN_UP_START":
			return {
				...state,
				isLoading: true,
				isSuccessful: false,
				error: new NoError(),
			};
		case "SIGN_UP_SUCCESS":
			return {
				...state,
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			};
		case "SIGN_UP_FAILURE":
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

export const useSignUp = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const signUp = useCallback(async (signUpInfo: SignUpInfo): Promise<void> => {
		const { email, password } = signUpInfo;
		dispatch({ type: "SIGN_UP_START" });

		try {
			await cognitoSignUp({ username: email, password });
			dispatch({ type: "SIGN_UP_SUCCESS" });
		} catch (error: unknown) {
			const occurredError =
				error instanceof Error &&
				Object.values(SignUpException).includes(
					(error as AppError).code as SignUpException,
				)
					? new AuthError((error as AppError).code as SignUpException)
					: new UnknownError();

			dispatch({ type: "SIGN_UP_FAILURE", payload: occurredError });
		}
	}, []);

	return { ...state, signUp };
};
