import { SignUpException } from "@/features/auth/error/const";
import { AuthError } from "@/features/auth/error/error";
import type { ConfirmAccountInfo } from "@/features/auth/types";
import type { AppError } from "@/utils/error";
import { NoError, UnknownError } from "@/utils/error";
import { confirmSignUp } from "aws-amplify/auth";
import { useCallback, useReducer } from "react";

// Define the shape of the state object
type State = {
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

// Define the shape of the action object
type Action =
	| {
			type: "CONFIRM_ACCOUNT_START";
	  }
	| {
			type: "CONFIRM_ACCOUNT_SUCCESS";
	  }
	| {
			type: "CONFIRM_ACCOUNT_FAILURE";
			payload: AppError;
	  };

// Define the initial state
const initialState: State = {
	isLoading: false,
	isSuccessful: false,
	error: new NoError(),
};

// Define the reducer function
const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "CONFIRM_ACCOUNT_START":
			return {
				...state,
				isLoading: true,
				isSuccessful: false,
				error: new NoError(),
			};
		case "CONFIRM_ACCOUNT_SUCCESS":
			return {
				...state,
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			};
		case "CONFIRM_ACCOUNT_FAILURE":
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

export const useConfirmAccount = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const confirmAccount = useCallback(
		async (confirmAccountInfo: ConfirmAccountInfo): Promise<void> => {
			const { email, confirmationCode } = confirmAccountInfo;
			dispatch({ type: "CONFIRM_ACCOUNT_START" });

			try {
				await confirmSignUp({
					username: email,
					confirmationCode,
				});
				dispatch({ type: "CONFIRM_ACCOUNT_SUCCESS" });
			} catch (error: unknown) {
				const occurredError =
					error instanceof Error &&
					Object.values(SignUpException).includes(
						(error as AppError).code as SignUpException,
					)
						? new AuthError((error as AppError).code as SignUpException)
						: new UnknownError();

				dispatch({ type: "CONFIRM_ACCOUNT_FAILURE", payload: occurredError });
			}
		},
		[],
	);

	return { ...state, confirmAccount };
};
