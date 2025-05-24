import { FileUploadException } from "@/features/menu/error";
import { StorageError } from "@/features/menu/error";
import type { Action, States } from "@/features/menu/hooks/type";
import { NoError, UnknownError } from "@/utils/error";
import type { FileWithPath } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import * as Encoding from "encoding-japanese";
import { useReducer } from "react";

// Define the initial state
const initialState: States = {
	files: {},
};

// Define the reducer function
const reducer = (state: States, action: Action): States => {
	switch (action.type) {
		case "FILE_UPLOAD_INIT":
			return {
				...initialState,
			};
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
		dispatch({ type: "FILE_UPLOAD_INIT" });
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

		const utf8Files = await readFileAsUTF8(files);

		for (const file of utf8Files) {
			dispatch({ type: "FILE_UPLOAD_START", payload: file.name });
			try {
				// Upload the file to S3
				await uploadData({
					path: `private/${session.identityId}/${file.name}`,
					data: file.utf8Content,
					options: {
						metadata: { "user-id": session.userSub ?? "" },
					},
				});

				dispatch({ type: "FILE_UPLOAD_SUCCESS", payload: file.name });
			} catch (error: unknown) {
				const occurredError =
					error instanceof Error &&
					Object.values(FileUploadException).includes(
						(error as AppError).code as FileUploadException,
					)
						? new StorageError((error as AppError).code as FileUploadException)
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
 * Reads the content of each file in the array and converts it to UTF-8 encoded text.
 *
 * @param {FileWithPath[]} files - The files to be read.
 * @returns {Promise<FileWithPath[]>} A Promise that resolves with an array of FileWithPath objects,
 *   where each object has a new property 'utf8Content' containing the UTF-8 encoded content string.
 */
const readFileAsUTF8 = async (
	files: FileWithPath[],
): Promise<(FileWithPath & { utf8Content: string })[]> => {
	const results: (FileWithPath & { utf8Content: string })[] = [];

	for (const file of files) {
		const uint8Array = new Uint8Array(await file.arrayBuffer());
		const detectedEncoding = Encoding.detect(uint8Array);
		const utf8Array = Encoding.convert(uint8Array, {
			from: detectedEncoding as Encoding.Encoding,
			to: "UNICODE",
		});
		const utf8Content = Encoding.codeToString(utf8Array);
		results.push({ ...file, name: file.name, utf8Content });
	}

	return results;
};
