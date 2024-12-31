import { FileUpload } from "@/features/menu/components/FileUpload";
import { FileUploadException, StorageError } from "@/features/menu/error";
import { useS3FileUpload } from "@/features/menu/hooks";
import { NoError } from "@/utils/error";
import { MantineProvider } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { BrowserRouter } from "react-router-dom";

// Mock the useS3FileUpload hook
jest.mock("@/features/menu/hooks/useS3FileUpload", () => ({
	useS3FileUpload: jest.fn(),
}));
jest.mock("@mantine/notifications", () => ({
	notifications: {
		show: jest.fn(),
		update: jest.fn(),
	},
}));
const mockUpload = jest.fn();

const mockedUseS3FileUpload = useS3FileUpload as jest.MockedFunction<
	typeof useS3FileUpload
>;

// Mock the utf-8 file data for testing
const utf8Content = new TextEncoder().encode("file content");
const mockFiles: FileWithPath[] = [
	new File([utf8Content], "test1.csv", { type: "text/csv" }),
	new File([utf8Content], "test2.csv", { type: "text/csv" }),
];

const createDataTransfer = (files: File[]) => ({
	dataTransfer: {
		files,
		items: files.map((file) => ({
			kind: "file",
			type: file.type,
			getAsFile: () => file,
		})),
		types: ["Files"],
	},
});

const generateRamdomString = () => Math.random().toString(36).substring(2, 15);

describe("FileUpload Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(notifications.show as jest.Mock).mockImplementation(() =>
			generateRamdomString(),
		);
	});

	const renderWithProviders = (ui: ReactElement) => {
		return render(
			<BrowserRouter>
				<MantineProvider>{ui}</MantineProvider>
			</BrowserRouter>,
		);
	};

	test("renders the upload button", () => {
		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValue({
			states: { files: {} },
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);

		expect(
			screen.getByRole("button", { name: "支出ファイル" }),
		).toBeInTheDocument();
	});

	test("call upload function when file is dropped", async () => {
		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValue({
			states: { files: {} },
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);
		const dropzone = screen.getByRole("presentation");
		const dataTransfer = createDataTransfer(mockFiles);

		fireEvent.drop(dropzone, dataTransfer);

		await waitFor(() => {
			expect(mockUpload).toHaveBeenCalledTimes(1);
		});
	});

	test("shows notification when file upload starts", async () => {
		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValue({
			states: {
				files: {
					"test1.csv": {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
					"test2.csv": {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
				},
			},
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);

		const dropzone = screen.getByRole("presentation");
		const dataTransfer = createDataTransfer(mockFiles);

		fireEvent.drop(dropzone, dataTransfer);

		await waitFor(() => {
			expect(notifications.show).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "アップロード中...",
					message: "test1.csv をアップロードしています...",
				}),
			);
			expect(notifications.show).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "アップロード中...",
					message: "test2.csv をアップロードしています...",
				}),
			);
		});
	});

	test("updates notification when file upload is successful", async () => {
		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValue({
			states: {
				files: {
					"test1.csv": {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
					"test2.csv": {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
				},
			},
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);

		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValueOnce({
			states: {
				files: {
					"test1.csv": {
						isLoading: false,
						isSuccessful: true,
						error: new NoError(),
					},
					"test2.csv": {
						isLoading: false,
						isSuccessful: true,
						error: new NoError(),
					},
				},
			},
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);

		await waitFor(() => {
			expect(notifications.update).toHaveBeenCalledWith(
				expect.objectContaining({
					// TODO: trouble shooting
					// id: expect.any(String),
					title: "アップロード完了",
					message: "test1.csv が正常にアップロードされました",
				}),
			);
			expect(notifications.update).toHaveBeenCalledWith(
				expect.objectContaining({
					// TODO: trouble shooting
					// id: expect.any(String),
					title: "アップロード完了",
					message: "test2.csv が正常にアップロードされました",
				}),
			);
		});
	});

	test("updates notification when file upload fails", async () => {
		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValue({
			states: {
				files: {
					"test1.csv": {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
					"test2.csv": {
						isLoading: true,
						isSuccessful: false,
						error: new NoError(),
					},
				},
			},
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);

		// Mock the error
		const mockError = new StorageError(FileUploadException.ObjectIsTooLarge);
		// Mock the useS3FileUpload hook
		mockedUseS3FileUpload.mockReturnValue({
			states: {
				files: {
					"test1.csv": {
						isLoading: false,
						isSuccessful: false,
						error: mockError,
					},
					"test2.csv": {
						isLoading: false,
						isSuccessful: false,
						error: mockError,
					},
				},
			},
			upload: mockUpload,
		});

		renderWithProviders(<FileUpload />);

		await waitFor(() => {
			expect(notifications.update).toHaveBeenCalledWith(
				expect.objectContaining({
					// TODO: trouble shooting
					// id: expect.any(String),
					title: mockError.title,
					message: mockError.message,
				}),
			);
		});
	});
});
