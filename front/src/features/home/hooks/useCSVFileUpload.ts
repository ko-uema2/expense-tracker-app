import { FileUploadException } from "@/features/home/error/const";
import { StorageError } from "@/features/home/error/error";
import type {
	Action,
	FailurePayload,
	FileState,
	States,
} from "@/features/home/hooks/type";
import { useFetchAuthSession } from "@/hooks/useFetchAuthSession";
import type { AppError } from "@/utils/error";
import { NoError, UnknownError } from "@/utils/error";
import { uploadData } from "aws-amplify/storage";
import * as Encoding from "encoding-japanese";
import { useCallback, useReducer } from "react";

// Define the initial state
const initialState: States = {
	files: [],
};

// files配列の中からfileNameで要素を検索し、なければ追加、あれば更新する共通関数
const upsertFileState = (
	files: FileState[],
	fileName: string,
	updater: () => FileState,
): States["files"] => {
	const idx = files.findIndex((f) => f.fileName === fileName);
	if (idx !== -1) {
		const updated = [...files];
		updated[idx] = updater();
		return updated;
	}
	return [...files, updater()];
};

const isBatchFailurePayload = (
	payload: FailurePayload,
): payload is { fileNames: string[]; error: AppError } => {
	return Array.isArray(payload.fileNames);
};

// Define the reducer function
const reducer = (state: States, action: Action): States => {
	switch (action.type) {
		case "FILE_UPLOAD_INIT":
			return { files: [] };
		case "FILE_UPLOAD_START":
			return {
				files: upsertFileState(state.files, action.payload, () => ({
					fileName: action.payload,
					isLoading: true,
					isSuccessful: false,
					error: new NoError(),
				})),
			};
		case "FILE_UPLOAD_SUCCESS":
			return {
				files: upsertFileState(state.files, action.payload, () => ({
					fileName: action.payload,
					isLoading: false,
					isSuccessful: true,
					error: new NoError(),
				})),
			};
		case "FILE_UPLOAD_FAILURE":
			return handleFileUploadFailure(state, action.payload);
		default: {
			return state;
		}
	}
};

// FILE_UPLOAD_FAILUREのpayloadが配列なら一括失敗、そうでなければ単一失敗
const handleFileUploadFailure = (
	state: States,
	payload: FailurePayload,
): States => {
	if (isBatchFailurePayload(payload)) {
		return {
			files: payload.fileNames.map((fileName: string) => ({
				fileName,
				isLoading: false,
				isSuccessful: false,
				error: payload.error,
			})),
		};
	}
	return {
		files: upsertFileState(state.files, payload.fileNames, () => ({
			fileName: payload.fileNames,
			isLoading: false,
			isSuccessful: false,
			error: payload.error,
		})),
	};
};

/**
 * A hook that provides a function to upload files to AWS S3 storage.
 *
 * @returns {Object} An object containing the loading state, error message, and file upload function.
 */
export const useCSVFileUpload = () => {
	const [states, dispatch] = useReducer(reducer, initialState);
	const { session, error, fetchAuthSession } = useFetchAuthSession();

	/**
	 * Handles the upload of selected files to AWS S3 storage.
	 *
	 * @param {File[]} files - アップロードするFileオブジェクト配列。
	 * @returns {Promise<void>} アップロード完了時にresolve。
	 */
	const upload = useCallback(
		async (files: File[]): Promise<void> => {
			dispatch({ type: "FILE_UPLOAD_INIT" });

			await fetchAuthSession();
			if (!(error instanceof NoError)) return;

			const utf8Files = await readFileAsUTF8(files);

			for (const file of utf8Files) {
				dispatch({ type: "FILE_UPLOAD_START", payload: file.name });
				try {
					await uploadData({
						path: `private/${session?.identityId}/${file.name}`,
						data: file.utf8Content,
						options: {
							metadata: { "user-id": session?.userSub ?? "" },
						},
					});
					dispatch({ type: "FILE_UPLOAD_SUCCESS", payload: file.name });
				} catch (error: unknown) {
					const occurredError =
						error instanceof Error &&
						Object.values(FileUploadException).includes(
							(error as AppError).code as FileUploadException,
						)
							? new StorageError(
									(error as AppError).code as FileUploadException,
								)
							: new UnknownError();

					dispatch({
						type: "FILE_UPLOAD_FAILURE",
						payload: { fileNames: file.name, error: occurredError },
					});
				}
			}
		},
		[fetchAuthSession, session, error],
	);

	return {
		states,
		upload,
	};
};

/**
 * Reads the content of each file in the array and converts it to UTF-8 encoded text.
 *
 * @param {File[]} files - Fileオブジェクト配列。
 * @returns {Promise<(File & { utf8Content: string })[]>}
 */
const readFileAsUTF8 = async (
	files: File[],
): Promise<(File & { utf8Content: string })[]> => {
	const results: (File & { utf8Content: string })[] = [];

	for (const file of files) {
		const uint8Array = new Uint8Array(await file.arrayBuffer());
		const detectedEncoding = Encoding.detect(uint8Array);
		const utf8Array = Encoding.convert(uint8Array, {
			from: detectedEncoding as Encoding.Encoding,
			to: "UNICODE",
		});
		const utf8Content = Encoding.codeToString(utf8Array);
		results.push(Object.assign(file, { utf8Content }));
	}

	return results;
};
