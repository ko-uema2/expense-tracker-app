import { AuthError, SignInException } from "@/features/auth/error";
import type { AuthInfo } from "@/features/auth/types";
import { type AppError, NoError, UnknownError } from "@/utils/error";
import { signIn as cognitoSignIn } from "aws-amplify/auth";
import { useReducer } from "react";

// // Define the shape of the state object
type State = {
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

// // Define the shape of the action object
type Action =
	| {
			type: "SIGN_IN_START";
	  }
	| {
			type: "SIGN_IN_SUCCESS";
	  }
	| {
			type: "SIGN_IN_FAILURE";
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
		case "SIGN_IN_START":
			return {
				...state,
				isLoading: true,
				isSuccessful: false,
				error: new NoError(),
			};
		case "SIGN_IN_SUCCESS":
			return {
				...state,
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			};
		case "SIGN_IN_FAILURE":
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
 * A hook that provides a function to sign in a user.
 *
 * @returns {Object} An object containing the loading state, error message, and sign-in function.
 */
export const useSignIn = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	/**
	 * Signs in a user using the provided authentication information.
	 *
	 * @param {AuthInfo} authInfo - An object containing the user's email and password.
	 * @returns {Promise<void>} A Promise that resolves when the sign-in is complete, or rejects with an error if the sign-in fails.
	 */
	const signIn = async (authInfo: AuthInfo): Promise<void> => {
		const { email, password } = authInfo;
		dispatch({ type: "SIGN_IN_START" });

		try {
			// Call the signIn function from the AWS Amplify Auth library
			await cognitoSignIn({
				username: email,
				password,
			});
			dispatch({ type: "SIGN_IN_SUCCESS" });
		} catch (error: unknown) {
			const occurredError =
				error instanceof Error &&
				Object.values(SignInException).includes(
					(error as AppError).code as SignInException,
				)
					? new AuthError((error as AppError).code as SignInException)
					: new UnknownError();

			dispatch({
				type: "SIGN_IN_FAILURE",
				payload: occurredError,
			});
		}
	};

	return {
		...state,
		signIn,
	};
};
