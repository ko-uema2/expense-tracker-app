import { FileUploadException } from "@/features/menu/error";
import { StorageError } from "@/features/menu/error";
import { type AppError, NoError, UnknownError } from "@/utils/error";
import type { FileWithPath } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import * as Encoding from "encoding-japanese";
import { useReducer } from "react";

// Define the shape of the state object
type FileState = {
	isLoading: boolean;
	isSuccessful: boolean;
	error: AppError;
};

type States = {
	files: Record<string, FileState>;
};

// Define the shape of the action object
type Action =
	| {
			type: "FILE_UPLOAD_START";
			payload: string;
	  }
	| {
			type: "FILE_UPLOAD_SUCCESS";
			payload: string;
	  }
	| {
			type: "FILE_UPLOAD_FAILURE";
			payload: { fileName: string; error: AppError };
	  };

// Define the initial state
const initialState: States = {
	files: {},
};

// Define the reducer function
const reducer = (state: States, action: Action): States => {
	switch (action.type) {
		case "FILE_UPLOAD_START":
			return {
				...state,
				files: {
					...state.files,
					[action.payload]: {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
				},
			};
		case "FILE_UPLOAD_SUCCESS":
			return {
				...state,
				files: {
					...state.files,
					[action.payload]: {
						isLoading: false,
						isSuccessful: true,
						error: new NoError(),
					},
				},
			};
		case "FILE_UPLOAD_FAILURE":
			return {
				...state,
				files: {
					...state.files,
					[action.payload.fileName]: {
						isLoading: false,
						isSuccessful: false,
						error: action.payload.error,
					},
				},
			};
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
	const [states, dispatch] = useReducer(reducer, initialState);

	/**
	 * Handles the upload of selected files to AWS S3 storage.
	 *
	 * @param {FileWithPath[]} files - A file to be uploaded, where each file is represented by a `FileWithPath` object containing the file data and its path.
	 * @returns {Promise<void>} A Promise that resolves when the upload is complete, or rejects with an error if the upload fails.
	 */
	const upload = async (files: FileWithPath[]): Promise<void> => {
		// Fetch the current user's session
		const session = await fetchAuthSession();
		if (!session || !session.identityId || !session.userSub) {
			for (const file of files) {
				dispatch({
					type: "FILE_UPLOAD_FAILURE",
					payload: {
						fileName: file.name,
						error: new StorageError(FileUploadException.NoCredentials),
					},
				});
			}
			return;
		}

		for (const file of files) {
			dispatch({ type: "FILE_UPLOAD_START", payload: file.name });
			try {
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

				dispatch({ type: "FILE_UPLOAD_SUCCESS", payload: file.name });
			} catch (error: unknown) {
				const occurredError =
					error instanceof Error &&
					Object.values(FileUploadException).includes(
						(error as Error).name as FileUploadException,
					)
						? new StorageError((error as Error).name as FileUploadException)
						: new UnknownError();

				dispatch({
					type: "FILE_UPLOAD_FAILURE",
					payload: { fileName: file.name, error: occurredError },
				});
			}
		}
	};

	return {
		states,
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