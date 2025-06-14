// TODO: 今後、useAuthToken.ts と useFetchAuthSession.ts を統合したい

import { type AppError, NoError } from "@/utils/error";
import { GeneralException } from "@/utils/error/const";
import { GeneralError, UnknownError } from "@/utils/error/error";
import {
	type AuthSession,
	fetchAuthSession as cognitoFetchAuthSession,
} from "aws-amplify/auth";
import { useCallback, useReducer } from "react";

// Define the shape of the state object
type State = {
	session: AuthSession | null;
	error: AppError;
};

// Define the shape of the action object
type Action =
	| {
			type: "FETCH_AUTH_SESSION_START";
	  }
	| {
			type: "FETCH_AUTH_SESSION_SUCCESS";
			payload: AuthSession;
	  }
	| {
			type: "FETCH_AUTH_SESSION_FAILURE";
			payload: AppError;
	  };

// Define the initial state
const initialState: State = {
	session: null,
	error: new NoError(),
};

// Define the reducer function
const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "FETCH_AUTH_SESSION_START":
			return {
				...state,
				session: null,
				error: new NoError(),
			};
		case "FETCH_AUTH_SESSION_SUCCESS":
			return {
				...state,
				session: action.payload,
				error: new NoError(),
			};
		case "FETCH_AUTH_SESSION_FAILURE":
			return {
				...state,
				session: null,
				error: action.payload,
			};
		default:
			return state;
	}
};

export const useFetchAuthSession = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const fetchAuthSession = useCallback(async (): Promise<void> => {
		dispatch({ type: "FETCH_AUTH_SESSION_START" });

		try {
			const session = await cognitoFetchAuthSession();
			dispatch({ type: "FETCH_AUTH_SESSION_SUCCESS", payload: session });
		} catch (error: unknown) {
			const occurredError =
				error instanceof Error &&
				Object.values(GeneralException).includes(
					(error as AppError).code as GeneralException,
				)
					? new GeneralError((error as AppError).code as GeneralException)
					: new UnknownError();

			dispatch({
				type: "FETCH_AUTH_SESSION_FAILURE",
				payload: occurredError,
			});
		}
	}, []);

	return {
		...state,
		fetchAuthSession,
	};
};
