import { TextEncoder } from "node:util";
import { FileUploadException } from "@/features/home/error/const";
import { StorageError } from "@/features/home/error/error";
import { useCSVFileUpload } from "@/features/home/hooks/useCSVFileUpload";
import { useFetchAuthSession } from "@/hooks/useFetchAuthSession";
import { NoError, UnknownError } from "@/utils/error";
import { GeneralException } from "@/utils/error/const";
import { GeneralError } from "@/utils/error/error";
import { act, renderHook } from "@testing-library/react";
import { uploadData } from "aws-amplify/storage";

jest.mock("aws-amplify/storage", () => ({
	uploadData: jest.fn(),
}));
jest.mock("@/hooks/useFetchAuthSession", () => {
	const actual = jest.requireActual("@/hooks/useFetchAuthSession");
	return {
		...actual,
		useFetchAuthSession: jest.fn(() => ({
			session: { identityId: "test-identityId", userSub: "test-userSub" },
			error: new NoError(),
			fetchAuthSession: jest.fn(),
		})),
	};
});

const mockedUseFetchAuthSession = useFetchAuthSession as jest.Mock;

// Mock the utf-8 file data for testing
const utf8Content = new TextEncoder().encode("file content");
const mockFiles: File[] = [
	new File([utf8Content], "test1.csv", { type: "text/csv" }),
	new File([utf8Content], "test2.csv", { type: "text/csv" }),
];

// Mock the arrayBuffer method of the File objects
for (const file of mockFiles) {
	file.arrayBuffer = jest.fn().mockResolvedValue(utf8Content.buffer);
}

describe("useCSVFileUpload", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Test case: Successful upload of a single file to S3.
	 *
	 * This test ensures that a single file is successfully uploaded to S3 and the correct parameters are passed to the `uploadData` function.
	 */
	test("正常系: 1つのファイルがS3に正常にアップロードされる", async () => {
		mockedUseFetchAuthSession.mockReturnValue({
			session: { identityId: "test-identityId", userSub: "test-userSub" },
			error: new NoError(),
			fetchAuthSession: jest.fn(),
		});
		(uploadData as jest.Mock).mockResolvedValue({});
		const singleFile = new File([utf8Content], "single.csv", {
			type: "text/csv",
		});
		singleFile.arrayBuffer = jest.fn().mockResolvedValue(utf8Content.buffer);

		const expectedUploadedStates = [
			{
				fileName: "single.csv",
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			},
		];

		const { result } = renderHook(() => useCSVFileUpload());

		await act(async () => {
			await result.current.upload([singleFile]);
		});

		expect(uploadData).toHaveBeenCalledTimes(1);
		result.current.states.files.forEach((actual, i) => {
			const expected = expectedUploadedStates[i];
			expect(actual.fileName).toBe(expected.fileName);
			expect(actual.isLoading).toBe(expected.isLoading);
			expect(actual.isSuccessful).toBe(expected.isSuccessful);
			expect(actual.error.message).toBe(expected.error.message);
		});
	});

	/**
	 * Test case: Successful file upload to S3.
	 *
	 * This test ensures that a file is successfully uploaded to S3 and the correct parameters are passed to the `uploadData` function.
	 */
	test("正常系: 2つのファイルがS3に正常にアップロードされる", async () => {
		mockedUseFetchAuthSession.mockReturnValue({
			session: { identityId: "test-identityId", userSub: "test-userSub" },
			error: new NoError(),
			fetchAuthSession: jest.fn(),
		});
		(uploadData as jest.Mock).mockResolvedValue({});
		const expectedUploadedStates = [
			{
				fileName: "test1.csv",
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			},
			{
				fileName: "test2.csv",
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			},
		];

		const { result } = renderHook(() => useCSVFileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(uploadData).toHaveBeenCalledTimes(mockFiles.length);
		// 各プロパティの値が等しいことをテスト
		result.current.states.files.forEach((actual, i) => {
			const expected = expectedUploadedStates[i];
			expect(actual.fileName).toBe(expected.fileName);
			expect(actual.isLoading).toBe(expected.isLoading);
			expect(actual.isSuccessful).toBe(expected.isSuccessful);
			expect(actual.error.message).toBe(expected.error.message);
		});
	});

	/**
	 * Test case: Handling upload failures and setting appropriate error messages.
	 *
	 * This test ensures that the hook sets an error message if the file upload fails.
	 */
	test("異常系: 2ファイルともアップロードに失敗する", async () => {
		mockedUseFetchAuthSession.mockReturnValue({
			session: { identityId: "test-identityId", userSub: "test-userSub" },
			error: new NoError(),
			fetchAuthSession: jest.fn(),
		});
		(uploadData as jest.Mock).mockRejectedValue(
			Object.assign(new Error("Object is too large"), {
				code: "ObjectIsTooLarge",
			}),
		);
		const expectedUploadedStates = [
			{
				fileName: "test1.csv",
				isLoading: false,
				isSuccessful: false,
				error: new StorageError(FileUploadException.ObjectIsTooLarge),
			},
			{
				fileName: "test2.csv",
				isLoading: false,
				isSuccessful: false,
				error: new StorageError(FileUploadException.ObjectIsTooLarge),
			},
		];

		const { result } = renderHook(() => useCSVFileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(uploadData).toHaveBeenCalledTimes(mockFiles.length);
		result.current.states.files.forEach((actual, i) => {
			const expected = expectedUploadedStates[i];
			expect(actual.fileName).toBe(expected.fileName);
			expect(actual.isLoading).toBe(expected.isLoading);
			expect(actual.isSuccessful).toBe(expected.isSuccessful);
			expect(actual.error.message).toBe(expected.error.message);
		});
	});

	/**
	 * Test case: 2ファイル中1つはアップロード成功し、もう1つは失敗する
	 *
	 * このテストケースでは、2つのファイルのうち1つは正常にアップロードされ、もう1つはアップロードに失敗することを確認します。
	 */
	test("異常系: 2ファイル中1つはアップロード成功し、もう1つは失敗する", async () => {
		mockedUseFetchAuthSession.mockReturnValue({
			session: { identityId: "test-identityId", userSub: "test-userSub" },
			error: new NoError(),
			fetchAuthSession: jest.fn(),
		});
		(uploadData as jest.Mock).mockReturnValueOnce({}).mockRejectedValueOnce(
			Object.assign(new Error("Object is too large"), {
				code: "ObjectIsTooLarge",
			}),
		);

		const expectedUploadedStates = [
			{
				fileName: "test1.csv",
				isLoading: false,
				isSuccessful: true,
				error: new NoError(),
			},
			{
				fileName: "test2.csv",
				isLoading: false,
				isSuccessful: false,
				error: new StorageError(FileUploadException.ObjectIsTooLarge),
			},
		];

		const { result } = renderHook(() => useCSVFileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(uploadData).toHaveBeenCalledTimes(2);
		result.current.states.files.forEach((actual, i) => {
			const expected = expectedUploadedStates[i];
			expect(actual.fileName).toBe(expected.fileName);
			expect(actual.isLoading).toBe(expected.isLoading);
			expect(actual.isSuccessful).toBe(expected.isSuccessful);
			expect(actual.error.message).toBe(expected.error.message);
		});
	});

	/**
	 * Test case: Handling unknown errors and setting a generic error message.
	 *
	 * This test ensures that the hook sets a generic error message if an unknown error occurs during the file upload.
	 */
	test("異常系: アップロード時に未知のエラーが発生した場合は汎用エラーメッセージが設定される", async () => {
		mockedUseFetchAuthSession.mockReturnValue({
			session: { identityId: "test-identityId", userSub: "test-userSub" },
			error: new NoError(),
			fetchAuthSession: jest.fn(),
		});
		// Mock the error object
		(uploadData as jest.Mock).mockRejectedValue(
			Object.assign(new Error("Unknown error occurred"), {
				code: "UnknownError",
			}),
		);
		const expectedUploadedStates = [
			{
				fileName: "test1.csv",
				isLoading: false,
				isSuccessful: false,
				error: new UnknownError(),
			},
			{
				fileName: "test2.csv",
				isLoading: false,
				isSuccessful: false,
				error: new UnknownError(),
			},
		];

		const { result } = renderHook(() => useCSVFileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(uploadData).toHaveBeenCalledTimes(mockFiles.length);
		result.current.states.files.forEach((actual, i) => {
			const expected = expectedUploadedStates[i];
			expect(actual.fileName).toBe(expected.fileName);
			expect(actual.isLoading).toBe(expected.isLoading);
			expect(actual.isSuccessful).toBe(expected.isSuccessful);
			expect(actual.error.message).toBe(expected.error.message);
		});
	});

	/**
	 * Test case: Handling missing `identityId` or `userSub` in the session.
	 *
	 * This test ensures that the hook sets an error message if the session is missing `identityId` or `userSub`.
	 */
	test("異常系: セッションにidentityIdまたはuserSubが存在しない場合は認証エラーが設定される", async () => {
		mockedUseFetchAuthSession.mockReturnValue({
			session: null,
			error: new GeneralError(GeneralException.NotAuthorizedException),
			fetchAuthSession: jest.fn(),
		});
		const expectedUploadedStates = [
			{
				fileName: "test1.csv",
				isLoading: false,
				isSuccessful: false,
				error: new GeneralError(GeneralException.NotAuthorizedException),
			},
			{
				fileName: "test2.csv",
				isLoading: false,
				isSuccessful: false,
				error: new GeneralError(GeneralException.NotAuthorizedException),
			},
		];

		const { result } = renderHook(() => useCSVFileUpload());

		await act(async () => {
			await result.current.upload(mockFiles);
		});

		expect(uploadData).toHaveBeenCalledTimes(0);
		result.current.states.files.forEach((actual, i) => {
			const expected = expectedUploadedStates[i];
			expect(actual.fileName).toBe(expected.fileName);
			expect(actual.isLoading).toBe(expected.isLoading);
			expect(actual.isSuccessful).toBe(expected.isSuccessful);
			expect(actual.error.message).toBe(expected.error.message);
		});
	});
});
