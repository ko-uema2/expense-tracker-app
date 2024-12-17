/**
 * @fileoverview Unit tests for the `useS3FileUpload` hook.
 *
 * This file contains tests for the `useS3FileUpload` hook, which is responsible for handling file uploads to S3.
 * The tests cover the following scenarios:
 * - Verifying the properties of the hook's return object.
 * - Successful file upload to S3.
 * - Handling upload failures and setting appropriate error messages.
 * - Handling unknown errors and setting a generic error message.
 * - Handling missing `identityId` or `userSub` in the session.
 *
 * Mocked dependencies:
 * - `aws-amplify/auth` for fetching the authentication session.
 * - `aws-amplify/storage` for uploading data to S3.
 *
 * Mocked data:
 * - A UTF-8 encoded file content for testing file uploads.
 *
 * @module useS3FileUpload.test
 */

import { TextEncoder } from "node:util";
import { FileUploadException, StorageError } from "@/features/menu/error";
import { useS3FileUpload } from "@/features/menu/hooks/useS3FileUpload";
import { NoError, UnknownError } from "@/utils/error";
import type { FileWithPath } from "@mantine/dropzone";
import { act, renderHook } from "@testing-library/react";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";

jest.mock("aws-amplify/auth", () => ({
	fetchAuthSession: jest.fn(),
}));

jest.mock("aws-amplify/storage", () => ({
	uploadData: jest.fn(),
}));

// Mock the utf-8 file data for testing
const utf8Content = new TextEncoder().encode("file content");
const mockFile: FileWithPath = new File([utf8Content], "test.csv", {
	type: "text/csv",
});
const mockFiles: FileWithPath[] = [mockFile, mockFile];

// Mock the arrayBuffer method of the FileWithPath object
mockFile.arrayBuffer = jest.fn().mockResolvedValue(utf8Content.buffer);

describe("useS3FileUpload", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test case: Verifying the properties of the hook's return object.
	 *
	 * This test ensures that the `useS3FileUpload` hook returns an object with the correct properties.
	 */
	test("should return an object with the correct properties", () => {
		const { result } = renderHook(() => useS3FileUpload());

		expect(result.current).toHaveProperty("states");
		expect(result.current.states).toHaveProperty("files");
		expect(result.current.states.files).toEqual({});
		expect(result.current).toHaveProperty("upload");
	});

	/**
	 * Test case: Successful file upload to S3.
	 *
	 * This test ensures that a file is successfully uploaded to S3 and the correct parameters are passed to the `uploadData` function.
	 */
	test("should upload two files to S3 successfully", async () => {
		(fetchAuthSession as jest.Mock).mockResolvedValue({
			identityId: "test-identityId",
			userSub: "test-userSub",
		});
		(uploadData as jest.Mock).mockResolvedValue({});

		const { result } = renderHook(() => useS3FileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(fetchAuthSession).toHaveBeenCalledTimes(1);
		expect(uploadData).toHaveBeenCalledTimes(mockFiles.length);
		for (const file of mockFiles) {
			expect(uploadData).toHaveBeenCalledWith({
				path: `private/test-identityId/${file.name}`,
				data: expect.any(String),
				options: {
					metadata: { "user-id": "test-userSub" },
				},
			});
			expect(result.current.states.files[file.name].isLoading).toBe(false);
			expect(result.current.states.files[file.name].isSuccessful).toBe(true);
			expect(result.current.states.files[file.name].error).toBeInstanceOf(
				NoError,
			);
		}
	});

	/**
	 * Test case: Handling upload failures and setting appropriate error messages.
	 *
	 * This test ensures that the hook sets an error message if the file upload fails.
	 */
	test("should set an error message if the upload fails", async () => {
		(fetchAuthSession as jest.Mock).mockResolvedValue({
			identityId: "test-identityId",
			userSub: "test-userSub",
		});
		// Mock the error object
		const error = new Error("Object is too large") as Error & {
			name: string;
		};
		error.name = FileUploadException.ObjectIsTooLarge;
		(uploadData as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useS3FileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(fetchAuthSession).toHaveBeenCalledTimes(1);
		expect(uploadData).toHaveBeenCalledTimes(mockFiles.length);
		for (const file of mockFiles) {
			expect(uploadData).toHaveBeenCalledWith({
				path: `private/test-identityId/${file.name}`,
				data: expect.any(String),
				options: {
					metadata: { "user-id": "test-userSub" },
				},
			});
			expect(result.current.states.files[file.name].isLoading).toBe(false);
			expect(result.current.states.files[file.name].isSuccessful).toBe(false);
			expect(result.current.states.files[file.name].error).toBeInstanceOf(
				StorageError,
			);
			expect(result.current.states.files[file.name].error.message).toBe(
				new StorageError(FileUploadException.ObjectIsTooLarge).message,
			);
		}
	});

	/**
	 * Test case: Handling unknown errors and setting a generic error message.
	 *
	 * This test ensures that the hook sets a generic error message if an unknown error occurs during the file upload.
	 */
	test("should set an error message if an unknown error occurs", async () => {
		(fetchAuthSession as jest.Mock).mockResolvedValue({
			identityId: "test-identityId",
			userSub: "test-userSub",
		});

		// Mock the error object
		const error = new Error("An unknown error occurred.") as Error & {
			name: string;
		};
		error.name = "UnknownError";
		(uploadData as jest.Mock).mockRejectedValue(error);

		const { result } = renderHook(() => useS3FileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(fetchAuthSession).toHaveBeenCalledTimes(1);
		expect(uploadData).toHaveBeenCalledTimes(mockFiles.length);
		for (const file of mockFiles) {
			expect(uploadData).toHaveBeenCalledWith({
				path: `private/test-identityId/${file.name}`,
				data: expect.any(String),
				options: {
					metadata: { "user-id": "test-userSub" },
				},
			});
			expect(result.current.states.files[file.name].isLoading).toBe(false);
			expect(result.current.states.files[file.name].isSuccessful).toBe(false);
			expect(result.current.states.files[file.name].error).toBeInstanceOf(
				UnknownError,
			);
			expect(result.current.states.files[file.name].error.message).toBe(
				"An unknown error occurred.",
			);
		}
	});

	/**
	 * Test case: Handling missing `identityId` or `userSub` in the session.
	 *
	 * This test ensures that the hook sets an error message if the session is missing `identityId` or `userSub`.
	 */
	test("should set an error message if the session is missing identityId or userSub", async () => {
		(fetchAuthSession as jest.Mock).mockResolvedValue({});

		const { result } = renderHook(() => useS3FileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(fetchAuthSession).toHaveBeenCalledTimes(1);
		expect(uploadData).toHaveBeenCalledTimes(0);
		for (const file of mockFiles) {
			expect(result.current.states.files[file.name].isLoading).toBe(false);
			expect(result.current.states.files[file.name].isSuccessful).toBe(false);
			expect(result.current.states.files[file.name].error).toBeInstanceOf(
				StorageError,
			);
			expect(result.current.states.files[file.name].error.message).toBe(
				new StorageError(FileUploadException.NoCredentials).message,
			);
		}
	});
});
