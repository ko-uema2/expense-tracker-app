import type { FileWithPath } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import * as Encoding from "encoding-japanese";
import { useReducer } from "react";

// Define the shape of the state object
type State = {
	loading: boolean;
	errMsg: string;
};

// Define the shape of the action object
type Action =
	| {
			type: "SET_LOADING";
			payload: boolean;
	  }
	| {
			type: "SET_ERROR";
			payload: string;
	  }
	| {
			type: "CLEAR_ERROR";
	  };

// Define the initial state
const initialState: State = {
	loading: false,
	errMsg: "",
};

// Define the reducer function
const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };
		case "SET_ERROR":
			return { ...state, errMsg: action.payload };
		case "CLEAR_ERROR":
			return { ...state, errMsg: "" };
		default:
			return state;
	}
};

/**
 * A hook that provides a function to upload files to AWS S3 storage.
 *
 * @returns {Object} An object containing the loading state, error message, and file upload function.
 */
export const useS3FileUpload = () => {
	const [state, dispatch] = useReducer(reducer, initialState);

	/**
	 * Handles the upload of selected files to AWS S3 storage.
	 *
	 * @param {FileWithPath} file - A file to be uploaded, where each file is represented by a `FileWithPath` object containing the file data and its path.
	 * @returns {Promise<void>} A Promise that resolves when the upload is complete, or rejects with an error if the upload fails.
	 */
	const upload = async (file: FileWithPath): Promise<void> => {
		dispatch({ type: "SET_LOADING", payload: true });

		try {
			// Fetch the current user's session
			const session = await fetchAuthSession();
			if (!session || !session.identityId || !session.userSub) {
				throw new Error("No identityId or userSub found in session");
			}

			// Read the content of the file as UTF-8 encoded text
			const fileContent = await readFileAsUTF8(file);

			// Upload the file to S3
			await uploadData({
				path: `private/${session.identityId}/${file.name}`,
				data: fileContent,
				options: {
					metadata: { "user-id": session.userSub },
				},
			});

			dispatch({ type: "CLEAR_ERROR" });
		} catch (error: unknown) {
			if (error instanceof Error) {
				dispatch({ type: "SET_ERROR", payload: error.message });
			} else {
				dispatch({
					type: "SET_ERROR",
					payload: "An error occurred. Please try again.",
				});
			}
		}

		dispatch({ type: "SET_LOADING", payload: false });
	};

	return {
		...state,
		upload,
	};
};

/**
 * Reads the content of a file and converts it to UTF-8 encoded text.
 *
 * @param {FileWithPath} file - The file to be read.
 * @returns {Promise<string>} A Promise that resolves with the UTF-8 encoded content of the file.
 */
const readFileAsUTF8 = async (file: FileWithPath): Promise<string> => {
	const arrayBuffer = await file.arrayBuffer();
	const uint8Array = new Uint8Array(arrayBuffer);

	// detect encoding of the file
	const detectedEncoding = Encoding.detect(uint8Array);

	// convert the file content to UTF-8
	const utf8Array = Encoding.convert(uint8Array, {
		from: detectedEncoding as Encoding.Encoding,
		to: "UNICODE",
	});

	// convert the UTF-8 array to a string
	return Encoding.codeToString(utf8Array);
};
